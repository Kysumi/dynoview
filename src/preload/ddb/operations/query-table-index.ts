import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getTableClient } from "../table";
import type { TTableQuery } from "@shared/table-query";
import { buildQueryOperation, DynamoOperatorsEnum } from "./build-query-operation";

export const queryTableIndex = async (params: TTableQuery) => {
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
  });

  return await dbClient.send(command);
};
