import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import useTableStore from "@renderer/store";
import QueryOperator from "./QueryOperator";
import { useState } from "react";

interface QueryBuilderProps {
  tableName: string;
  indexName: string;

  partitionKeyValue: string;
  searchKey: {
    operator: string;
    value: string;
  };

  limit: number;
}

export const Query = () => {
  const { activeTable, activeAWSRegion } = useTableStore();

  const [result, setResult] = useState<any>(null);

  if (!activeTable) return null;

  const gsi = activeTable.indexes.gsiIndexes ?? [];
  const indexes = [activeTable.indexes.primary, ...gsi];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const indexName = formData.get("index") as string;
    const partitionKeyValue = formData.get("partitionKeyValue") as string;
    const searchKeyValue = formData.get("searchKeyValue") as string;
    const operator = formData.get("operator") as string;

    const partitionKey = indexes.find((index) => index.partitionKey.name === indexName)?.partitionKey.name;

    if (!partitionKey) {
      throw new Error("Partition key not found");
    }

    const result = await window.api.queryTableIndex({
      region: activeAWSRegion,
      tableName: activeTable.tableName,
      indexName: indexName,
      partitionKey: partitionKey,
      partitionKeyValue: partitionKeyValue,
      searchKey: {
        operator: operator,
        value: searchKeyValue,
      },
      limit: 50,
    });

    setResult(result);
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      {/* Index */}
      <Select required={true} key="index" name="index" label="Index" placeholder="Select an index">
        {indexes.map((index) => (
          <SelectItem key={index.partitionKey.name}>{index.partitionKey.name}</SelectItem>
        ))}
      </Select>

      <Input required={true} label="Partition Key" name="partitionKeyValue" />

      {/* Search Key */}
      <QueryOperator />
      <Input label="Search Key Value" name="searchKeyValue" />

      <Button type="submit">Run Query</Button>
    </form>
  );
};
