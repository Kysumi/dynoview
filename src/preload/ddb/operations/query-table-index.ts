import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getTableClient } from "../table";
import type { TTableQuery } from "@shared/table-query";

export const queryTableIndex = async (params: TTableQuery) => {
  const { region, tableName, indexName, partitionKey, partitionKeyValue } = params;

  const dbClient = getTableClient(region);

  const command = new QueryCommand({
    TableName: tableName,
    IndexName: indexName === tableName ? undefined : indexName,
    KeyConditionExpression: `${partitionKey} = :${partitionKey}`,
    ExpressionAttributeValues: {
      [`:${partitionKey}`]: partitionKeyValue,
    },
  });

  const response = await dbClient.send(command);

  return response;
};
