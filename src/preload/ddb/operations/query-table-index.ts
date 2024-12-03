import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getTableClient } from "../table";
import type { TTableQuery } from "@shared/table-query";

export const queryTableIndex = async (params: TTableQuery) => {
  const { region, tableName, indexName, partitionKey, partitionKeyValue, roleName, accountId } = params;

  console.log(roleName, accountId);

  const dbClient = await getTableClient({
    accountId,
    region,
    roleName,
  });

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
