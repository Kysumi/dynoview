import { z } from "zod";

const SSOuser = z.object({
  accountId: z.string(),
  roleName: z.string(),
});

export type TSSOuser = z.infer<typeof SSOuser>;

export const TableQuery = z
  .object({
    region: z.string(),

    tableName: z.string(),
    indexName: z.string(),

    partitionKey: z.string(),
    partitionKeyValue: z.string(),

    searchKeyValue: z.string(),
    searchKeyOperator: z.string(),

    limit: z.number().optional(),
  })
  .merge(SSOuser);

export type TTableQuery = z.infer<typeof TableQuery>;
