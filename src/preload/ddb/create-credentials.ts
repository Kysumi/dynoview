import { SSOClient, GetRoleCredentialsCommand } from "@aws-sdk/client-sso";
import type { AwsCredentialIdentity } from "@aws-sdk/types";

interface GetCredentialsParams {
  accessToken: string;
  region: string;
  accountId: string;
  roleName: string;
}

export const createAWSCredentialsFromSSOToken = async ({
  accessToken,
  region,
  accountId,
  roleName,
}: GetCredentialsParams): Promise<AwsCredentialIdentity> => {
  const ssoClient = new SSOClient({ region });

  const response = await ssoClient.send(
    new GetRoleCredentialsCommand({
      accessToken,
      accountId,
      roleName,
    }),
  );

  if (!response.roleCredentials) {
    throw new Error("No credentials returned from SSO service");
  }

  return {
    accessKeyId: response.roleCredentials.accessKeyId ?? "",
    secretAccessKey: response.roleCredentials.secretAccessKey ?? "",
    sessionToken: response.roleCredentials.sessionToken,
    expiration: new Date(response.roleCredentials.expiration ?? 0),
  };
};
