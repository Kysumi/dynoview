import { ListTablesCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

interface ListAvailableTablesArgs {
  region: string;
}

export const listAvailableTables = async ({ region }: ListAvailableTablesArgs): Promise<string[]> => {
  const client = DynamoDBDocument.from(
    new DynamoDBClient({
      region,
    }),
  );

  try {
    const tables = await client.send(new ListTablesCommand({}));
    return tables.TableNames?.map((table) => table) ?? [];
  } catch (e) {
    console.error("Failed to list tables:", e);
    // Check if the error message includes keywords related to credentials
    if (e instanceof Error && (e.message.includes("credentials") || e.message.includes("authentication"))) {
      throw new Error("AWS credentials are missing, expired, or invalid.");
    }

    throw new Error("Failed to retrieve table list. Please try again later.");
  }
};
