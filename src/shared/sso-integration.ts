import { z } from "zod";

export const SSOIntegrationSchema = z.object({
  integrationType: z.literal("AWS"),
  alias: z.string().min(5, { message: "Alias must be at least 5 characters" }),
  portalUrl: z.string().min(1, { message: "Portal URL is required" }),
  awsRegion: z.string().min(1, { message: "AWS Region is required" }),
  method: z.enum(["browser"]),
});

export type SSOIntegration = z.infer<typeof SSOIntegrationSchema>;

export const AWSRegions = [
  { region: "af-south-1", name: "Africa (Cape Town)" },
  { region: "ap-east-1", name: "Asia Pacific (Hong Kong)" },
  { region: "ap-northeast-1", name: "Asia Pacific (Tokyo)" },
  { region: "ap-northeast-2", name: "Asia Pacific (Seoul)" },
  { region: "ap-northeast-3", name: "Asia Pacific (Osaka)" },
  { region: "ap-south-1", name: "Asia Pacific (Mumbai)" },
  { region: "ap-south-2", name: "Asia Pacific (Hyderabad)" },
  { region: "ap-southeast-1", name: "Asia Pacific (Singapore)" },
  { region: "ap-southeast-2", name: "Asia Pacific (Sydney)" },
  { region: "ap-southeast-3", name: "Asia Pacific (Jakarta)" },
  { region: "ap-southeast-4", name: "Asia Pacific (Melbourne)" },
  { region: "ap-southeast-5", name: "Asia Pacific (Malaysia)" },
  { region: "ca-central-1", name: "Canada (Central)" },
  { region: "ca-west-1", name: "Canada West (Calgary)" },
  { region: "cn-north-1", name: "China (Beijing)" },
  { region: "cn-northwest-1", name: "China (Ningxia)" },
  { region: "eu-central-1", name: "Europe (Frankfurt)" },
  { region: "eu-north-1", name: "Europe (Stockholm)" },
  { region: "eu-south-1", name: "Europe (Milan)" },
  { region: "eu-south-2", name: "Europe (Spain)" },
  { region: "eu-west-1", name: "Europe (Ireland)" },
  { region: "eu-west-2", name: "Europe (London)" },
  { region: "eu-west-3", name: "Europe (Paris)" },
  { region: "il-central-1", name: "Israel (Tel Aviv)" },
  { region: "me-central-1", name: "Middle East (UAE)" },
  { region: "me-south-1", name: "Middle East (Bahrain)" },
  { region: "sa-east-1", name: "South America (São Paulo)" },
  { region: "us-east-1", name: "US East (N. Virginia)" },
  { region: "us-east-2", name: "US East (Ohio)" },
  { region: "us-west-1", name: "US West (N. California)" },
  { region: "us-west-2", name: "US West (Oregon)" },
];

export type AWSRegion = (typeof AWSRegions)[number];
