import {
  SSOClient,
  GetRoleCredentialsCommand,
  ListAccountsCommand,
  ListAccountRolesCommand,
} from "@aws-sdk/client-sso";
import {
  SSOOIDCClient,
  StartDeviceAuthorizationCommand,
  CreateTokenCommand,
  RegisterClientCommand,
} from "@aws-sdk/client-sso-oidc";
import { BrowserWindow } from "electron";
import { SecureLocalStore } from "../secure-local-store";

export class AWSSSOHandler {
  private ssoOidcClient: SSOOIDCClient;
  private ssoClient: SSOClient;
  private store: SecureLocalStore;

  constructor(private config: { startUrl: string; region: string }) {
    this.ssoOidcClient = new SSOOIDCClient({ region: config.region });
    this.ssoClient = new SSOClient({ region: config.region });
    this.store = new SecureLocalStore("sso-client-registration");
  }

  private async registerClient() {
    const stored = this.store.get("clientRegistration");

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
      clientId: response.clientId!,
      clientSecret: response.clientSecret!,
      expiresAt: Date.now() + response.clientSecretExpiresAt! * 1000,
    };

    this.store.set("clientRegistration", registration);
    return registration;
  }

  async startSSOFlow() {
    try {
      const client = await this.registerClient();

      const deviceAuthResponse = await this.ssoOidcClient.send(
        new StartDeviceAuthorizationCommand({
          clientId: client.clientId,
          clientSecret: client.clientSecret,
          startUrl: this.config.startUrl,
        }),
      );

      // Create browser window after app is ready
      const authWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "AWS SSO Login",
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
      });

      // Load the verification URL
      console.log("Loading URL:", deviceAuthResponse.verificationUriComplete);
      await authWindow.loadURL(deviceAuthResponse.verificationUriComplete!);

      // Poll for token
      const token = await this.pollForToken(deviceAuthResponse.deviceCode!, client, deviceAuthResponse.interval || 5);

      // Close window after successful authentication
      authWindow.close();
      return token;
    } catch (error) {
      console.error("SSO authentication failed:", error);
      throw error;
    }
  }

  private async pollForToken(deviceCode: string, client: { clientId: string; clientSecret: string }, interval: number) {
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

        return {
          accessToken: tokenResponse.accessToken,
          expiresIn: tokenResponse.expiresIn,
        };
      } catch (error) {
        if (error.name === "AuthorizationPendingException") {
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
}