import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { electronAPI } from "@electron-toolkit/preload";

interface TableClientArgs {
  region: string;
  roleName: string;
  accountId: string;
}

export const getTableClient = async ({ region, roleName, accountId }: TableClientArgs) => {
  try {
    const credentials = await electronAPI.ipcRenderer.invoke("aws:get-credentials", {
      roleName,
      accountId,
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
