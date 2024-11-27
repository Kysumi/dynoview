import { DescribeTableCommand, type KeySchemaElement } from "@aws-sdk/client-dynamodb";
import type { TableInfo } from "@shared/table-info";
import { getTableClient } from "../table";

export const getTableInformation = async ({
  tableName,
  region,
}: { tableName: string; region: string }): Promise<TableInfo> => {
  const client = await getTableClient(region);

  const tableInfo = await client.send(new DescribeTableCommand({ TableName: tableName }));

  if (tableInfo.Table === undefined) {
    throw new Error("Table does not exist");
  }

  if (!tableInfo.Table.KeySchema) {
    throw new Error("Table does not have a primary key");
  }

  const primaryIndex = tableInfo.Table.KeySchema;

  const awsToApp = (combo: KeySchemaElement[]) => {
    const pk = combo.find((index) => index.KeyType === "HASH");
    const sk = combo.find((index) => index.KeyType === "RANGE");

    if (!pk || !sk) {
      throw new Error("Table does not have a primary key");
    }

    return {
      partitionKey: {
        name: pk.AttributeName ?? "",
        type: "HASH",
      },
      searchKey: {
        name: sk.AttributeName ?? "",
        type: "RANGE",
      },
    };
  };

  const secondaryIndexes =
    tableInfo.Table.GlobalSecondaryIndexes?.map((index) => {
      return {
        name: index.IndexName ?? "",
        ...awsToApp(index.KeySchema ?? []),
      };
    }) ?? [];

  return {
    tableName,
    indexes: {
      primary: { name: tableName, ...awsToApp(primaryIndex) },
      gsiIndexes: secondaryIndexes,
    },
  };
};
