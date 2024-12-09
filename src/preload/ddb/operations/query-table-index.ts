import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getTableClient } from "../table";
import type { TTableQuery } from "@shared/table-query";
import { buildQueryOperation, DynamoOperatorsEnum } from "./build-query-operation";
import type { DynamoResults } from "@shared/dynamo-results";

export const queryTableIndex = async (params: TTableQuery): Promise<DynamoResults> => {
  const {
    region,
    tableName,
    indexName,
    partitionKey,
    partitionKeyValue,
    roleName,
    accountId,
    searchKey,
    searchKeyOperator,
    searchKeyValue,
    nextPage,
  } = params;

  const dbClient = await getTableClient({
    accountId,
    region,
    roleName,
  });

  const partitionKeyCondition = buildQueryOperation(partitionKey, partitionKeyValue, DynamoOperatorsEnum.equals);

  let keyConditionExpression = partitionKeyCondition.expression;
  let expressionAttributeValues = partitionKeyCondition.values;

  if (searchKeyValue && searchKey && searchKeyOperator) {
    const searchKeyCondition = buildQueryOperation(searchKey, searchKeyValue, searchKeyOperator);
    keyConditionExpression += ` AND ${searchKeyCondition.expression}`;
    expressionAttributeValues = {
      ...expressionAttributeValues,
      ...searchKeyCondition.values,
    };
  }

  const command = new QueryCommand({
    TableName: tableName,
    IndexName: indexName === tableName ? undefined : indexName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExclusiveStartKey: nextPage,
    ReturnConsumedCapacity: "TOTAL",
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
