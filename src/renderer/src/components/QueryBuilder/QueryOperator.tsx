import { forwardRef } from "react";
import { Select, SelectItem, type SelectProps } from "@nextui-org/react";

const operators = [
  { key: "=", label: "equal" },
  { key: ">", label: "greater than" },
  { key: "<", label: "less than" },
  { key: ">=", label: "greater than or equal to" },
  { key: "<=", label: "less than or equal to" },
  { key: "between", label: "between" },
  { key: "begins_with", label: "begins with" },
];

const QueryOperator = forwardRef<HTMLSelectElement, Omit<SelectProps, "children">>((props, ref) => {
  return (
    <Select
      ref={ref}
      label="Operator"
      placeholder="Select an operator"
      defaultSelectedKeys={["="]}
      className="max-w-xs"
      {...props}
    >
      {operators.map((operator) => (
        <SelectItem key={operator.key}>{operator.label}</SelectItem>
      ))}
    </Select>
  );
});

QueryOperator.displayName = "QueryOperator";

export default QueryOperator;
