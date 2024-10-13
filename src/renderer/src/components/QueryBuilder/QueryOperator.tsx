import { Select, SelectItem } from "@nextui-org/react";

const operators = [
  { key: "=", label: "equal" },
  { key: ">", label: "greater than" },
  { key: "<", label: "less than" },
  { key: ">=", label: "greater than or equal to" },
  { key: "<=", label: "less than or equal to" },
  { key: "between", label: "between" },
  { key: "begins_with", label: "begins with" },
];

export default function QueryOperator() {
  return (
    <Select label="Operator" placeholder="Select an operator" defaultSelectedKeys={["eq"]} className="max-w-xs">
      {operators.map((operator) => (
        <SelectItem key={operator.key}>{operator.label}</SelectItem>
      ))}
    </Select>
  );
}
