import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import useTableStore from "@renderer/store";
import QueryOperator from "./QueryOperator";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableQuery } from "@shared/table-query";

export const Query = () => {
  const { activeTable, activeAWSRegion } = useTableStore();
  const [result, setResult] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(TableQuery),
  });

  if (!activeTable) return null;

  const gsi = activeTable.indexes.gsiIndexes ?? [];
  const indexes = [activeTable.indexes.primary, ...gsi];

  const onSubmit = handleSubmit(
    async (data) => {
      console.log(data);

      const { indexName, partitionKey, partitionKeyValue, searchKeyOperator, searchKeyValue } = data;

      const result = await window.api.queryTableIndex({
        region: activeAWSRegion,
        tableName: activeTable.tableName,
        indexName: indexName,
        partitionKey: partitionKey,
        partitionKeyValue: partitionKeyValue,
        searchKeyOperator: searchKeyOperator,
        searchKeyValue: searchKeyValue,
        limit: 50,
      });

      setResult(result);
    },
    (errors) => {
      console.log(errors);
    },
  );

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <input type="hidden" {...register("tableName")} value={activeTable.tableName} />
      <input type="hidden" {...register("region")} value={activeAWSRegion} />

      <div>{JSON.stringify(errors, null, 2)}</div>
      {/* Index */}
      <Select required={true} key="index" {...register("indexName")} label="Index" placeholder="Select an index">
        {indexes.map((index) => (
          <SelectItem key={index.partitionKey.name}>{index.partitionKey.name}</SelectItem>
        ))}
      </Select>

      <Input required={true} label="Partition Key" {...register("partitionKeyValue")} />

      {/* Search Key */}
      <QueryOperator {...register("searchKeyOperator")} />
      <Input label="Search Key Value" {...register("searchKeyValue")} />

      <Button type="submit">Run Query</Button>
    </form>
  );
};
