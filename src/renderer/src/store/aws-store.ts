import type { AWSAccount } from "@shared/aws-accounts";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AWSConfig {
  id: string;
  startUrl: string;
  region: string;
  accounts: AWSAccount[];
  name: string;
}

interface AWSStore {
  awsConfig: AWSConfig[];
  addConfig: (config: AWSConfig) => void;
  updateConfig: (config: AWSConfig) => void;
  removeConfig: (id: string) => void;
}

export const useAWSStore = create<AWSStore>()(
  persist(
    (set) => ({
      awsConfig: [],
      addConfig: (config) =>
        set((state) => ({
          awsConfig: [...state.awsConfig, config],
        })),
      updateConfig: (updatedConfig) =>
        set((state) => ({
          awsConfig: state.awsConfig.map((config) => (config.id === updatedConfig.id ? updatedConfig : config)),
        })),
      removeConfig: (id) =>
        set((state) => ({
          awsConfig: state.awsConfig.filter((config) => config.id !== id),
        })),
    }),
    {
      name: "aws-store",
    },
  ),
);
