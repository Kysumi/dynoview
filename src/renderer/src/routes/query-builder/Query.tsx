import QueryOperator from "./QueryOperator";
import { useEffect, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableQuery, type TTableQuery } from "@shared/table-query";
import type { QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { ComboBox } from "@components/ComboBox";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Form, FormItem, FormLabel } from "@components/Form";
import { useTab } from "@renderer/hooks/TabContext";
import { ResultsTable } from "./ResultsTable";
import { buildColumns } from "./buildColumns";
import { AccountRoleSelector } from "@renderer/components/AccountRoleSelector";
import { useAWSStore } from "@renderer/store/aws-store";
import { DatabaseSelector } from "./components/DatabaseSelector";
import { Label } from "@renderer/components/Label";
import { type Tab, useTabStore } from "@renderer/store/tab-store";

const SharedStuff = () => {
  const { awsConfig } = useAWSStore();

  const first = awsConfig[0];

  return (
    <div className="flex gap-2">
      <AccountRoleSelector accounts={first.accounts} />
      <DatabaseSelector />
    </div>
  );
};

export const Query = () => {
  const { tab } = useTab();
  const { storeTabFormState } = useTabStore();

  const form = useForm<TTableQuery>({
    resolver: zodResolver(TableQuery),
    defaultValues: {
      searchKeyOperator: "begins_with",
      ...tab.formState,
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: This effect should only run once
  useEffect(() => {
    return () => {
      const formState = form.getValues();
      storeTabFormState(tab.id, formState);
    };
  }, []);

  return (
    <Form {...form}>
      <SharedStuff />
      <FormContent tab={tab} />
    </Form>
  );
};

const FormContent = ({ tab }: { tab: Tab }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryCommandOutput | null>(null);
  const { control, register, handleSubmit, setValue } = useFormContext();

  const activeTable = tab.table;
  const activeAWSRegion = tab.awsRegion;

  if (!activeTable) return null;

  const gsi = activeTable.indexes.gsiIndexes ?? [];
  const indexes = [activeTable.indexes.primary, ...gsi];

  const onSubmit = handleSubmit(
    async (data) => {
      setLoading(true);
      const result = await window.api.queryTableIndex(data);
      setResult(result);
      setLoading(false);
    },
    (errors) => {
      console.log(errors);
    },
  );

  return (
    <form className="flex flex-col gap-2 mt-2" onSubmit={onSubmit}>
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
          <div className="flex flex-col gap-2">
            <Label>Index</Label>
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
          </div>
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
      <div>
        <Button size={"lg"} type="submit" loading={loading}>
          Run Query
        </Button>
      </div>
      <ResultsTable data={result?.Items ?? []} columns={buildColumns(result, { maxDepth: 1 })} />
    </form>
  );
};
