import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { getTableClient } from "../table";
import type { TTableScan } from "@shared/table-scan";

export const scanTable = async (params: TTableScan) => {
  const { region, tableName, limit, accountId, roleName } = params;

  const command = new ScanCommand({
    TableName: tableName,
    Limit: limit,
  });

  const dbClient = await getTableClient({
    accountId,
    region,
    roleName,
  });

  const response = await dbClient.send(command);

  return response;
};
