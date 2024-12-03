import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { createAWSCredentialsFromSSOToken } from "./create-credentials";
import { electronAPI } from "@electron-toolkit/preload";

interface TableClientArgs {
  region: string;
  roleName: string;
  accountId: string;
}

export const getTableClient = async ({ region, roleName, accountId }: TableClientArgs) => {
  const token = await electronAPI.ipcRenderer.invoke("aws:get-token");

  try {
    const credentials = await createAWSCredentialsFromSSOToken({
      accessToken: token.accessToken,
      region,
      accountId,
      roleName,
    });

    return DynamoDBDocument.from(
      new DynamoDBClient({
        region,
        credentials,
      }),
    );
  } catch (e) {
    console.log("FAILED TO GET SOMETHING");
    console.error(e);
    throw e;
  }
};
