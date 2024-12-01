import type { ElectronAPI } from "@electron-toolkit/preload";
import type { Api } from "./index";

declare global {
  interface Window {
    electron: ElectronAPI & {
      ipcRenderer: {
        invoke(channel: "aws:start-sso", startUrl: string): Promise<void>;
        invoke(
          channel: "aws:list-roles",
          params: {
            accessToken: string;
            accountId: string;
          },
        ): Promise<
          Array<{
            roleName: string;
            accountId: string;
          }>
        >;
      };
    };
    api: Api;
  }
}
