import { z } from "zod";

const SSOuser = z.object({
  accountId: z.string(),
  roleName: z.string(),
});

export const TableScan = z
  .object({
    region: z.string(),
    tableName: z.string(),
    limit: z.number(),
    nextPage: z.object({}).optional(),
  })
  .merge(SSOuser);

export type TTableScan = z.infer<typeof TableScan>;
