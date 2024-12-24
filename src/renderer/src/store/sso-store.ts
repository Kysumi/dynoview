import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SSOState {
  isInitializing: boolean;
  isAuthenticated: boolean;
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

        if (state.isInitializing) {
          return;
        }
        await window.electron.ipcRenderer.invoke("aws:init-sso", config);

        set({ isInitializing: true });
        try {
          const token = await window.electron.ipcRenderer.invoke("aws:authorise-device");

          set({
            expiresAt: token.expiresAt,
            isAuthenticated: true,
            isInitializing: false,
          });
        } catch (error) {
          console.error("Failed to start SSO:", error);
          set({ isAuthenticated: false, expiresAt: null, isInitializing: false });
        }
      },
    }),
    {
      name: "sso",
      partialize: (state) =>
        Object.fromEntries(Object.entries(state).filter(([key]) => !["isInitializing"].includes(key))),
    },
  ),
);
