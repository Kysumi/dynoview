import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import type { QueryType } from "@renderer/store/tab-store";

interface QueryStatsProps {
  retrievedItems: number;
  scannedItems: number;
  consumedCapacity: number;
  queryType: QueryType;
}

export const QueryStats = ({ retrievedItems, scannedItems, consumedCapacity, queryType }: QueryStatsProps) => {
  const scannedTooltip =
    queryType === "query"
      ? "The total number of items evaluated before applying any filters. A high ratio between scanned and retrieved items might indicate that your query could be optimized."
      : "The total number of items scanned. In scan operations, this number can be high as it needs to traverse the entire table. Consider using queries when possible.";

  return (
    <div className="text-sm text-muted-foreground flex items-center gap-4">
      <div className="flex items-center gap-1">
        Retrieved {retrievedItems} items
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="h-4 w-4 cursor-help opacity-50 hover:opacity-100 transition-opacity" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            The number of items returned by the query/scan operation that match your criteria.
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-1">
        Scanned {scannedItems} items
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="h-4 w-4 cursor-help opacity-50 hover:opacity-100 transition-opacity" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            {scannedTooltip}
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-1">
        Consumed {consumedCapacity.toFixed(2)} RCU
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="h-4 w-4 cursor-help opacity-50 hover:opacity-100 transition-opacity" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            Read Capacity Units (RCU) consumed by this operation. This affects your AWS billing and table throughput
            limits.
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
