import { z } from "zod";

export const SSOIntegrationSchema = z.object({
  integrationType: z.literal("AWS"),
  alias: z.string(),
  portalUrl: z.string(),
  awsRegion: z.string(),
  method: z.enum(["browser"]),
});

export type SSOIntegration = z.infer<typeof SSOIntegrationSchema>;
