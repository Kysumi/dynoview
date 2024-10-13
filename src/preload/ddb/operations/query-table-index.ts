import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, QueryCommand } from "@aws-sdk/lib-dynamodb";

interface QueryTableIndexParams {
  region: string;

  tableName: string;
  indexName: string;

  partitionKey: string;
  partitionKeyValue: string;
  searchKey: {
    operator: string;
    value: string;
  };

  limit: number;
}

export const queryTableIndex = async (params: QueryTableIndexParams) => {
  const { region, tableName, indexName, partitionKey, partitionKeyValue, searchKeyValue, operator } = params;

  const docClient = DynamoDBDocument.from(
    new DynamoDBClient({
      region,
    }),
  );

  const command = new QueryCommand({
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: `${partitionKey} = :${partitionKey}`,
    ExpressionAttributeValues: {
      [`:${partitionKey}`]: partitionKeyValue,
    },
  });

  const response = await docClient.send(command);

  return response;
};
