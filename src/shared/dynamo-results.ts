export interface DynamoResults {
  queriedAt: string;
  items: Record<string, unknown>[];
  // Number of items returned by the query
  count: number;
  // Number of items that were present before the filters were applied
  scannedCount: number;

  nextPage?: Record<string, unknown>;
  consumedCapacity?: number;
  roundTripTimeMs: number;
}
