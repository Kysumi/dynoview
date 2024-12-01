import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AWSStore {
  startUrl?: string;
  region?: string;
  setStartUrl: (url: string, region: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

export const useAWSStore = create<AWSStore>()(
  persist(
    (set) => ({
      ssoStartUrl: undefined,
      region: undefined,
      setStartUrl: (url, region) => set({ startUrl: url, region }),
      isAuthenticated: false,
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    }),
    {
      name: "aws-store",
    },
  ),
);
