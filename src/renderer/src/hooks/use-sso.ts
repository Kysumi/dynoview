import { useEffect } from "react";
import { useSSOStore } from "../store/sso-store";
import { useAWSStore } from "@renderer/store/aws-store";

export const useSSO = () => {
  const { awsConfig } = useAWSStore();
  const { isAuthenticated, accessToken, expiresAt, startSSO } = useSSOStore();

  useEffect(() => {
    const checkAuth = async () => {
      const config = awsConfig[0];
      if (!config) {
        return;
      }

      await startSSO({
        startUrl: config.startUrl,
        region: config.region,
      });
    };

    checkAuth();
  }, [isAuthenticated, expiresAt, startSSO]);

  return { isAuthenticated, accessToken };
};
