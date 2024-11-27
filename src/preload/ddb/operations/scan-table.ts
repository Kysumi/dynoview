import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { getTableClient } from "../table";

interface ScanTableParams {
  region: string;
  tableName: string;
  limit: number;
}

export const scanTable = async (params: ScanTableParams) => {
  const { region, tableName, limit } = params;

  const command = new ScanCommand({
    TableName: tableName,
    Limit: limit,
  });

  const dbClient = await getTableClient(region);

  const response = await dbClient.send(command);

  return response;
};
