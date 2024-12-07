import { z } from "zod";

const SSOuser = z.object({
  accountId: z.string(),
  roleName: z.string(),
});

export type TSSOuser = z.infer<typeof SSOuser>;

export enum DynamoOperatorsEnum {
  equals = "=",
  less_than = "<",
  less_than_equals = "<=",
  greater_than = ">",
  greater_than_equals = ">=",
  between = "between",
  begins_with = "begins_with",
}

const ddbOperators = z.nativeEnum(DynamoOperatorsEnum, {
  description: "Valid DynamoDB comparison operators",
});
export type TDDBOperators = z.infer<typeof ddbOperators>;

export const TableQuery = z
  .object({
    region: z.string(),

    tableName: z.string(),
    indexName: z.string(),

    partitionKey: z.string(),
    partitionKeyValue: z.string(),

    searchKey: z.string(),
    searchKeyValue: z.string(),
    searchKeyOperator: ddbOperators,

    limit: z.number().optional(),
  })
  .merge(SSOuser);

export type TTableQuery = z.infer<typeof TableQuery>;
