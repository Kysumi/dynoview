import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import useTableStore from "@renderer/store";
import QueryOperator from "./QueryOperator";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableQuery, type TTableQuery } from "@shared/table-query";
import type { QueryCommandOutput } from "@aws-sdk/client-dynamodb";

export const Query = () => {
  const { activeTable, activeAWSRegion } = useTableStore();
  const [result, setResult] = useState<QueryCommandOutput | null>(null);

  const { control, register, handleSubmit, setValue } = useForm<TTableQuery>({
    resolver: zodResolver(TableQuery),
  });

  if (!activeTable) return null;

  const gsi = activeTable.indexes.gsiIndexes ?? [];
  const indexes = [activeTable.indexes.primary, ...gsi];

  const onSubmit = handleSubmit(
    async (data) => {
      console.log(data);

      const result = await window.api.queryTableIndex(data);
      setResult(result);
    },
    (errors) => {
      console.log(errors);
    },
  );
  console.log(activeTable.indexes);

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <input type="hidden" {...register("tableName")} value={activeTable.tableName} />
      <input type="hidden" {...register("region")} value={activeAWSRegion} />
      <input type="hidden" {...register("limit", { valueAsNumber: true })} value={50} />

      {/* Index */}
      <Controller
        control={control}
        name="indexName"
        rules={{ required: true }}
        defaultValue={indexes[0].partitionKey.name}
        render={({ field }) => (
          <Select
            required={true}
            key="index"
            {...field}
            onChange={(e) => {
              console.log(e);
              // Set the index name
              field.onChange(e);

              const index = indexes.find((index) => index.name === e.target.value);

              if (!index) {
                return;
              }

              setValue("partitionKey", index.partitionKey.name);
            }}
            label="Index"
            placeholder="Select an index"
          >
            {indexes.map((index) => (
              <SelectItem key={index.name}>{index.name}</SelectItem>
            ))}
          </Select>
        )}
      />

      <Input required={true} label="Partition Key" {...register("partitionKeyValue")} />

      {/* Search Key */}
      <QueryOperator {...register("searchKeyOperator")} />
      <Input label="Search Key Value" {...register("searchKeyValue")} />

      <pre>{JSON.stringify(result, null, 2)}</pre>

      <Button type="submit">Run Query</Button>
    </form>
  );
};
