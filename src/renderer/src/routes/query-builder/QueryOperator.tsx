import { SelectItem, Select, SelectTrigger, SelectValue, SelectContent } from "@components/Select";

const operators = [
  { key: "=", label: "Equal to" },
  { key: ">", label: "Greater than" },
  { key: "<", label: "Less than" },
  { key: ">=", label: "Greater than or equal to" },
  { key: "<=", label: "Less than or equal to" },
  { key: "between", label: "Between" },
  { key: "begins_with", label: "Begins with" },
];

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
}

const QueryOperator = ({ onChange, value }: SelectProps) => {
  return (
    <Select defaultValue={value} onValueChange={onChange}>
      <SelectTrigger className="max-w-xs">
        <SelectValue placeholder="Select an operator" />
      </SelectTrigger>

      <SelectContent>
        {operators.map((operator) => (
          <SelectItem key={operator.key} value={operator.key}>
            {operator.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

QueryOperator.displayName = "QueryOperator";

export default QueryOperator;
