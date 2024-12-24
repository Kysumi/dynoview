import type { ElectronAPI } from "@electron-toolkit/preload";
import type { Api } from "./index";

interface Token {
  accessToken: string;
  accountId: string;
}

declare global {
  interface Window {
    electron: ElectronAPI & {
      ipcRenderer: {
        invoke(channel: "aws:init-sso", config: { startUrl: string; region: string }): Promise<boolean>;
        invoke(
          channel: "aws:list-roles",
          params: Token,
        ): Promise<
          Array<{
            roleName: string;
            accountId: string;
          }>
        >;
        invoke(
          channel: "aws:list-roles",
          params: Token,
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
