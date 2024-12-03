import { ipcMain } from "electron";
import { AWSSSOHandler } from "./sso";

let ssoHandler: AWSSSOHandler | null = null;

export const attachAWSHandles = () => {
  // Register IPC handlers
  ipcMain.handle("aws:init-sso", async (_, config: { startUrl: string; region: string }) => {
    ssoHandler = new AWSSSOHandler(config);
    return true;
  });

  ipcMain.handle("aws:start-sso", async () => {
    if (!ssoHandler) {
      throw new Error("SSO not initialized");
    }
    return await ssoHandler.startSSOFlow();
  });

  ipcMain.handle("aws:list-accounts", async (_, accessToken: string) => {
    if (!ssoHandler) {
      throw new Error("SSO not initialized");
    }
    return await ssoHandler.listAccounts(accessToken);
  });

  ipcMain.handle("aws:list-roles", async (_, params: { accessToken: string; accountId: string }) => {
    if (!ssoHandler) {
      throw new Error("SSO not initialized");
    }
    return await ssoHandler.listAccountRoles(params.accessToken, params.accountId);
  });

  ipcMain.handle("aws:get-token", async () => {
    if (!ssoHandler) {
      throw new Error("SSO not initialized");
    }
    return await ssoHandler.getToken();
  });
};
