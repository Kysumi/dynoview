import type { ColumnDef } from "@tanstack/react-table";
import type { TableDataType } from "./TableDataType";

type CellFuncType = ColumnDef<TableDataType>["cell"];

export const DataCell: CellFuncType = ({ column, getValue }) => {
  const value = getValue();

  if (typeof value === "string") {
    return <div>{value}</div>;
  }

  if (Array.isArray(value)) {
    return <div>Not supported</div>;
  }

  if (typeof value === "object") {
    return <div>{JSON.stringify(value)}</div>;
  }

  if (typeof value === "undefined") {
    return <div />;
  }

  /**
   * Maybe swap to checkboxs? Text seems OK though
   */
  if (typeof value === "boolean") {
    return <div>{String(value)}</div>;
  }

  throw new Error(`Unsupported data type for ${column.id}`);
};
