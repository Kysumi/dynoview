import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { getTableClient } from "../table";
import type { TTableScan } from "@shared/table-scan";
import type { DynamoResults } from "@shared/dynamo-results";

export const scanTable = async (params: TTableScan): Promise<DynamoResults> => {
  const { region, tableName, limit, accountId, roleName, nextPage } = params;

  const command = new ScanCommand({
    TableName: tableName,
    Limit: limit,
    ExclusiveStartKey: nextPage,
    ReturnConsumedCapacity: "TOTAL",
  });

  const dbClient = await getTableClient({
    accountId,
    region,
    roleName,
  });
  const start = performance.now();
  const response = await dbClient.send(command);
  const end = performance.now();

  return {
    items: response.Items as Record<string, unknown>[],
    count: response.Count ?? 0,
    scannedCount: response.ScannedCount ?? 0,
    nextPage: response.LastEvaluatedKey,
    consumedCapacity: response.ConsumedCapacity?.CapacityUnits ?? 0,
    roundTripTimeMs: Math.round(end - start),
    queriedAt: new Date().toISOString(),
  };
};
