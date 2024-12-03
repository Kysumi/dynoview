import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SSOState {
  isInitializing: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  expiresAt: number | null;
  startSSO: (config: { startUrl: string; region: string }) => Promise<void>;
}

export const useSSOStore = create<SSOState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      accessToken: null,
      expiresAt: null,
      isInitializing: false,

      startSSO: async (config) => {
        const state = get();
        console.log(state);

        console.warn("Refreshing SSO");
        await window.electron.ipcRenderer.invoke("aws:init-sso", config);

        if (state.isInitializing) {
          return;
        }

        set({ isInitializing: true });
        try {
          const token = await window.electron.ipcRenderer.invoke("aws:get-token");

          console.log(token);

          set({
            accessToken: token.accessToken,
            expiresAt: token.expiresAt,
            isAuthenticated: true,
            isInitializing: false,
          });
        } catch (error) {
          console.error("Failed to start SSO:", error);
          set({ isAuthenticated: false, accessToken: null, expiresAt: null, isInitializing: false });
        }
      },
    }),
    {
      name: "sso",
    },
  ),
);
