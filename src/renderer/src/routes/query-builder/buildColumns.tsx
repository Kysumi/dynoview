import type { ColumnDef } from "@tanstack/react-table";
import { DataCell } from "@components/Table/DataCell";
import type { TableDataType } from "@components/Table/TableDataType";

type Column = {
  accessorKey: string;
  header: string;
} & Pick<ColumnDef<TableDataType>, "cell">;

type BuildColumnsOptions = {
  maxDepth?: number; // undefined means no limit
};

export const buildColumns = (data: unknown, options: BuildColumnsOptions = {}): ColumnDef<TableDataType>[] => {
  const columns = new Set<string>();

  const flattenObject = (obj: Record<string, unknown>, prefix = "", currentDepth = 0): void => {
    // Check if we've reached the maximum depth
    if (typeof options.maxDepth === "number" && currentDepth >= options.maxDepth) {
      // Add the current prefix as a column and stop recursion
      if (prefix.endsWith(".")) {
        columns.add(prefix.slice(0, -1)); // Remove trailing dot
      }
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        // Recursive call for nested objects
        flattenObject(value as Record<string, unknown>, `${prefix}${key}.`, currentDepth + 1);
      } else {
        // For arrays and primitive values
        const finalKey = prefix + key;
        columns.add(finalKey);
      }
    }
  };

  if (!Array.isArray(data) || !data.length) {
    return [];
  }

  // Take the first item as a sample for column structure
  const sampleItem = data[0];
  if (typeof sampleItem === "object" && sampleItem !== null) {
    flattenObject(sampleItem as Record<string, unknown>);
  }

  const sortedColumns = Array.from(columns)
    .filter(Boolean)
    .map(
      (key): Column => ({
        accessorKey: key,
        header: key,
        cell: (attr) => <DataCell {...attr} />,
      }),
    )
    .sort((a, b) => a.accessorKey.localeCompare(b.accessorKey));

  return sortedColumns;
};
