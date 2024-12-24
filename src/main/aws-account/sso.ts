import {
  SSOClient,
  ListAccountsCommand,
  ListAccountRolesCommand,
  GetRoleCredentialsCommand,
} from "@aws-sdk/client-sso";
import {
  SSOOIDCClient,
  StartDeviceAuthorizationCommand,
  CreateTokenCommand,
  RegisterClientCommand,
  AuthorizationPendingException,
} from "@aws-sdk/client-sso-oidc";
import { BrowserWindow } from "electron";

const DEVICE_AUTHORISATION_KEY = "token";

export interface TokenStore {
  get<ReturnType extends Record<string, unknown>>(key: string): ReturnType | undefined;
  set(key: string, value: Record<string, unknown>): void;
}

interface Registration {
  clientId: string;
  clientSecret: string;
  expiresAt: number;
}

export interface AWSToken {
  accessToken: string;
  expiresIn: number;
}

export interface Token extends Record<string, unknown> {
  accessToken: string;
  expiresAt: number;
}

export interface Credentials {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly accountId: string;
  readonly sessionToken?: string;
  readonly expiration: Date;
}

export class AWSSSOHandler {
  private ssoOidcClient: SSOOIDCClient;
  private ssoClient: SSOClient;
  private store: TokenStore;
  private tokenLock: Promise<Token> | null = null;

  constructor(private config: { startUrl: string; region: string; store: TokenStore }) {
    this.ssoOidcClient = new SSOOIDCClient({ region: config.region });
    this.ssoClient = new SSOClient({ region: config.region });
    this.store = config.store;
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

  private async startSSOFlow(): Promise<AWSToken> {
    // Check for existing valid token first
    const existingToken = this.store.get("token") as Token | undefined;
    if (existingToken && existingToken.expiresAt > Date.now()) {
      console.log("OLD TOKEN IS STILL VALID, REUSE IT!");
      return {
        accessToken: existingToken.accessToken,
        expiresIn: Math.floor((existingToken.expiresAt - Date.now()) / 1000),
      };
    }

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

        const storedToken: Token = {
          accessToken: token.accessToken,
          expiresAt: Date.now() + (token.expiresIn || 28800) * 1000,
        };

        this.store.set("token", storedToken);

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

  async listAccounts() {
    const { accessToken } = await this.getToken();
    const response = await this.ssoClient.send(
      new ListAccountsCommand({
        accessToken,
      }),
    );
    return response.accountList || [];
  }

  async listAccountRoles(accountId: string) {
    try {
      const { accessToken } = await this.getToken();

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

  /**
   * Get the token for the device
   * This will either return the token from the store if it's still valid
   *
   * @returns The token for the device
   */
  private async getToken(): Promise<Token> {
    if (this.store.get(DEVICE_AUTHORISATION_KEY)) {
      const token = this.store.get<Token>(DEVICE_AUTHORISATION_KEY);
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
        this.store.set(DEVICE_AUTHORISATION_KEY, token);
        return token;
      } finally {
        // Clear the lock when done (success or failure)
        this.tokenLock = null;
      }
    })();

    return this.tokenLock;
  }

  /**
   * Little wrapper
   */
  async authoriseDevice() {
    const response = await this.getToken();
    return { expiresAt: response.expiresAt };
  }

  /**
   * Allows you to get the credentials that can be used to assume a role in a specific account
   * and allowing you to interact with AWS resources that the role has access to.
   *
   * @returns Credentials for the specific account and role provided
   */
  async getCredentials({ accountId, roleName }: { accountId: string; roleName: string }): Promise<Credentials> {
    const token = await this.getToken();

    const response = await this.ssoClient.send(
      new GetRoleCredentialsCommand({
        accessToken: token.accessToken,
        accountId,
        roleName,
      }),
    );

    if (!response.roleCredentials) {
      throw new Error("No credentials returned from SSO service");
    }

    return {
      accountId: accountId,
      accessKeyId: response.roleCredentials.accessKeyId ?? "",
      secretAccessKey: response.roleCredentials.secretAccessKey ?? "",
      sessionToken: response.roleCredentials.sessionToken,
      expiration: new Date(response.roleCredentials.expiration ?? 0),
    };
  }
}
