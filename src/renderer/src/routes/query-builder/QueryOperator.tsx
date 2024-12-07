import { SelectItem, Select, SelectTrigger, SelectValue, SelectContent } from "@components/Select";
import { DynamoOperatorsEnum } from "@shared/table-query";

const operators: { key: DynamoOperatorsEnum; label: string }[] = [
  { key: DynamoOperatorsEnum.equals, label: "Equal to" },
  { key: DynamoOperatorsEnum.greater_than, label: "Greater than" },
  { key: DynamoOperatorsEnum.less_than, label: "Less than" },
  { key: DynamoOperatorsEnum.greater_than_equals, label: "Greater than or equal to" },
  { key: DynamoOperatorsEnum.less_than_equals, label: "Less than or equal to" },
  { key: DynamoOperatorsEnum.between, label: "Between" },
  { key: DynamoOperatorsEnum.begins_with, label: "Begins with" },
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
