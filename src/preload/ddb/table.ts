import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { fromSSO } from "@aws-sdk/credential-provider-sso";

export const getTableClient = async (region: string) => {
  return DynamoDBDocument.from(
    new DynamoDBClient({
      region,
      credentials: await fromSSO({})(),
    }),
  );
};
