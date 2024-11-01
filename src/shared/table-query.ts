import { z } from "zod";

export const TableQuery = z.object({
  region: z.string(),

  tableName: z.string(),
  indexName: z.string(),

  partitionKey: z.string(),
  partitionKeyValue: z.string(),

  searchKeyValue: z.string(),
  searchKeyOperator: z.string(),

  limit: z.number(),
});

export type TTableQuery = z.infer<typeof TableQuery>;
