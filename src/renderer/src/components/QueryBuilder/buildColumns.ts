type Column = {
  accessorKey: string;
  header: string;
};

type BuildColumnsOptions = {
  maxDepth?: number; // undefined means no limit
};

export const buildColumns = (data: unknown, options: BuildColumnsOptions = {}): Column[] => {
  const columns = new Set<string>();

  const flattenObject = (obj: Record<string, any>, prefix = "", currentDepth = 0): void => {
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
        flattenObject(value, `${prefix}${key}.`, currentDepth + 1);
      } else {
        // For arrays and primitive values
        const finalKey = prefix + key;
        columns.add(finalKey);
      }
    }
  };

  const processItems = (items: unknown[]) => {
    if (!Array.isArray(items) || !items.length) return;

    // Take the first item as a sample for column structure
    const sampleItem = items[0];
    if (typeof sampleItem === "object" && sampleItem !== null) {
      flattenObject(sampleItem);
    }
  };

  if (typeof data === "object" && data !== null) {
    const items = (data as any).Items;
    processItems(items);
  }

  const sortedColumns = Array.from(columns)
    .filter(Boolean)
    .map((key) => ({
      accessorKey: key,
      header: key,
    }))
    .sort((a, b) => a.accessorKey.localeCompare(b.accessorKey));

  return sortedColumns;
};
