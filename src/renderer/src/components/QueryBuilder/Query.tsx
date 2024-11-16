import useTableStore from "@renderer/store";
import QueryOperator from "./QueryOperator";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableQuery, type TTableQuery } from "@shared/table-query";
import type { QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { ComboBox } from "../ComboBox";
import { Button } from "../Button";
import { Input } from "../Input";
import { Form, FormItem, FormLabel } from "../Form";
import { useTab } from "@renderer/hooks/TabContext";

export const Query = () => {
  const { tab } = useTab();
  const { activeTable, activeAWSRegion, storeTabFormState } = useTableStore();
  const [result, setResult] = useState<QueryCommandOutput | null>(null);

  const form = useForm<TTableQuery>({
    resolver: zodResolver(TableQuery),
    defaultValues: {
      searchKeyOperator: "=",
      ...tab.formState,
    },
  });

  useEffect(() => {
    return () => {
      const formState = form.getValues();
      storeTabFormState(tab.id, formState);
    };
  }, []);

  const { control, register, handleSubmit, setValue } = form;

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

  return (
    <Form {...form}>
      <form className="flex flex-col gap-2" onSubmit={onSubmit}>
        <input type="hidden" {...register("tableName")} value={activeTable.tableName} />
        <input type="hidden" {...register("region")} value={activeAWSRegion} />
        <input type="hidden" {...register("limit", { valueAsNumber: true })} value={50} />

        {/* Index */}
        <Controller
          control={control}
          name="indexName"
          rules={{ required: true }}
          defaultValue={indexes[0].name}
          render={({ field }) => (
            <ComboBox
              placeHolder="Select index"
              selectedOption={field.value}
              options={indexes.map((index) => ({ value: index.name, label: index.name }))}
              onChange={async (option): Promise<void> => {
                // Set the index name
                field.onChange(option.value);

                const index = indexes.find((index) => index.name === option.value);

                if (!index) {
                  return;
                }

                setValue("partitionKey", index.partitionKey.name);
              }}
            />
          )}
        />

        <FormItem>
          <FormLabel>Partition Key</FormLabel>
          <Input placeholder="Enter partition key value" required={true} {...register("partitionKeyValue")} />
        </FormItem>

        {/* Search Key */}
        <div className="flex gap-2">
          <FormItem className="min-w-40">
            <FormLabel>Operator</FormLabel>
            <Controller
              control={control}
              name="searchKeyOperator"
              render={({ field }) => <QueryOperator onChange={field.onChange} value={field.value} />}
            />
          </FormItem>

          <FormItem className="flex-1">
            <FormLabel>Search Key Value</FormLabel>
            <Input className="w-full" placeholder="Enter search key value" {...register("searchKeyValue")} />
          </FormItem>
        </div>
        <pre>{JSON.stringify(result, null, 2)}</pre>

        <Button type="submit">Run Query</Button>
      </form>
    </Form>
  );
};
