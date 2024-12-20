import { SSOClient, ListAccountsCommand, ListAccountRolesCommand } from "@aws-sdk/client-sso";
import {
  SSOOIDCClient,
  StartDeviceAuthorizationCommand,
  CreateTokenCommand,
  RegisterClientCommand,
  AuthorizationPendingException,
} from "@aws-sdk/client-sso-oidc";
import { BrowserWindow } from "electron";
import { SecureLocalStore } from "../secure-local-store";

interface Registration {
  clientId: string;
  clientSecret: string;
  expiresAt: number;
}

export interface AWSToken {
  accessToken: string;
  expiresIn: number;
}

export interface Token {
  accessToken: string;
  expiresAt: number;
}

export class AWSSSOHandler {
  private ssoOidcClient: SSOOIDCClient;
  private ssoClient: SSOClient;
  private store: SecureLocalStore;
  private tokenStore: Map<string, Token>;
  private tokenLock: Promise<Token> | null = null;

  constructor(
    private config: { startUrl: string; region: string },
    tokenStore: Map<string, Token>,
  ) {
    this.ssoOidcClient = new SSOOIDCClient({ region: config.region });
    this.ssoClient = new SSOClient({ region: config.region });
    this.store = new SecureLocalStore("sso-client-registration");
    this.tokenStore = tokenStore;
  }

  private async registerClient(): Promise<Registration> {
    const stored = this.store.get("clientRegistration") as Registration | undefined;

    if (stored && stored.expiresAt > Date.now()) {
      return stored;
    }

    const response = await this.ssoOidcClient.send(
      new RegisterClientCommand({
        clientName: "DynoView",
        clientType: "public",
      }),
    );

    const registration = {
      clientId: response.clientId ?? "",
      clientSecret: response.clientSecret ?? "",
      expiresAt: Date.now() + (response.clientSecretExpiresAt ?? 0) * 1000,
    };

    this.store.set("clientRegistration", registration);
    return registration;
  }

  async startSSOFlow(): Promise<AWSToken> {
    try {
      const client = await this.registerClient();

      const deviceAuthResponse = await this.ssoOidcClient.send(
        new StartDeviceAuthorizationCommand({
          clientId: client.clientId,
          clientSecret: client.clientSecret,
          startUrl: this.config.startUrl,
        }),
      );

      const authWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "AWS SSO Login",
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
          webSecurity: true,
          allowRunningInsecureContent: false,
        },
      });

      if (deviceAuthResponse.verificationUriComplete) {
        await authWindow.loadURL(deviceAuthResponse.verificationUriComplete);
      } else {
        throw new Error("Verification URI is missing.");
      }

      if (deviceAuthResponse.deviceCode) {
        const token = await this.pollForToken(deviceAuthResponse.deviceCode, client, deviceAuthResponse.interval || 5);
        authWindow.close();
        return token;
      }
      authWindow.close();
      throw new Error("Device code is missing.");
    } catch (error) {
      console.error("SSO authentication failed:", error);
      throw error;
    }
  }

  private async pollForToken(
    deviceCode: string,
    client: { clientId: string; clientSecret: string },
    interval: number,
  ): Promise<AWSToken> {
    const maxAttempts = 60; // 5 minutes timeout
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const tokenResponse = await this.ssoOidcClient.send(
          new CreateTokenCommand({
            clientId: client.clientId,
            clientSecret: client.clientSecret,
            grantType: "urn:ietf:params:oauth:grant-type:device_code",
            deviceCode,
          }),
        );

        if (!tokenResponse.accessToken || !tokenResponse.expiresIn) {
          throw new Error("Access token is missing");
        }

        return {
          accessToken: tokenResponse.accessToken,
          expiresIn: tokenResponse.expiresIn,
        };
      } catch (error) {
        if (error instanceof AuthorizationPendingException) {
          await new Promise((resolve) => setTimeout(resolve, interval * 1000));
          attempts++;
          continue;
        }
        throw error;
      }
    }

    throw new Error("SSO authentication timed out");
  }

  async listAccounts(accessToken: string) {
    const response = await this.ssoClient.send(
      new ListAccountsCommand({
        accessToken,
      }),
    );
    return response.accountList || [];
  }

  async listAccountRoles(accessToken: string, accountId: string) {
    try {
      const response = await this.ssoClient.send(
        new ListAccountRolesCommand({
          accessToken,
          accountId,
        }),
      );

      return response.roleList || [];
    } catch (error) {
      console.error("Failed to list account roles:", error);
      throw new Error("Failed to retrieve account roles");
    }
  }

  async getToken(): Promise<Token> {
    const key = "token";

    if (this.tokenStore.has(key)) {
      const token = this.tokenStore.get(key);
      if (token && token.expiresAt > Date.now()) {
        return token;
      }
    }

    // If there's an ongoing token request, wait for it
    if (this.tokenLock) {
      return this.tokenLock;
    }

    // Create a new token request
    this.tokenLock = (async () => {
      try {
        const result = await this.startSSOFlow();
        const token: Token = {
          accessToken: result.accessToken,
          expiresAt: Date.now() + (result.expiresIn || 28800) * 1000,
        };
        this.tokenStore.set(key, token);
        return token;
      } finally {
        // Clear the lock when done (success or failure)
        this.tokenLock = null;
      }
    })();

    return this.tokenLock;
  }
}
