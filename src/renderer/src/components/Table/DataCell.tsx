export const DataCell = ({ column, getValue }) => {
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

  if (typeof value === "number") {
    return <div>{value}</div>;
  }

  console.log(value);
  throw new Error(`Unsupported data type for ${column.id}`);
};
