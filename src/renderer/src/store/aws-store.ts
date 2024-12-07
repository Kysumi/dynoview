import type { AWSAccount } from "@shared/aws-accounts";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AWSConfig {
  id: string;
  startUrl: string;
  region: string;
  accounts: AWSAccount[];
}

interface AWSStore {
  awsConfig: AWSConfig[];
  addConfig: (config: AWSConfig) => void;
}

export const useAWSStore = create<AWSStore>()(
  persist(
    (set) => ({
      awsConfig: [],
      addConfig: (config) =>
        set((state) => ({
          awsConfig: [...state.awsConfig, config],
        })),
    }),
    {
      name: "aws-store",
    },
  ),
);
