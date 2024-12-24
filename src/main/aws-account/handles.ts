import { ipcMain } from "electron";
import { AWSSSOHandler } from "./sso";
import { SecureStore } from "./secure-store";

let ssoHandler: AWSSSOHandler | null = null;
const store = new SecureStore(".dynoview-store");

export const attachAWSHandles = () => {
  // Register IPC handlers
  ipcMain.handle("aws:init-sso", async (_, config: { startUrl: string; region: string }) => {
    ssoHandler = new AWSSSOHandler({
      ...config,
      store,
    });
    return true;
  });

  ipcMain.handle("aws:authorise-device", async () => {
    if (!ssoHandler) {
      throw new Error("SSO not initialized");
    }
    return await ssoHandler.authoriseDevice();
  });

  ipcMain.handle("aws:list-accounts", async (_) => {
    if (!ssoHandler) {
      throw new Error("SSO not initialized");
    }
    return await ssoHandler.listAccounts();
  });

  ipcMain.handle("aws:list-roles", async (_, params: { accountId: string }) => {
    if (!ssoHandler) {
      throw new Error("SSO not initialized");
    }
    return await ssoHandler.listAccountRoles(params.accountId);
  });

  ipcMain.handle("aws:get-credentials", async (_, { accountId, roleName }: { accountId: string; roleName: string }) => {
    if (!ssoHandler) {
      throw new Error("SSO not initialized");
    }
    return await ssoHandler.getCredentials({
      accountId,
      roleName,
    });
  });
};
