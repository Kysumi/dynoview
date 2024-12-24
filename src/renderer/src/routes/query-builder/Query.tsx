import { useEffect, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DynamoOperatorsEnum, TableQuery, type TTableQuery } from "@shared/table-query";
import type { DynamoResults } from "@shared/dynamo-results";
import { ComboBox } from "@components/ComboBox";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Form, FormItem, FormLabel } from "@components/Form";
import { useTab } from "@renderer/hooks/TabContext";
import { ResultsTable } from "./ResultsTable";
import { buildColumns } from "./buildColumns";
import { Label } from "@renderer/components/Label";
import { type Tab, useTabStore } from "@renderer/store/tab-store";
import { AccountAndDatabaseBar } from "./components/AccountAndDatabaseBar";
import { useToast } from "@renderer/hooks/use-toast";
import type { TableDataType } from "@components/Table/TableDataType";
import QueryOperator from "./QueryOperator";
import { QueryStats } from "@renderer/components/QueryStats";

export const Query = () => {
  const { tab } = useTab();
  const { storeTabFormState } = useTabStore();

  const form = useForm<TTableQuery>({
    resolver: zodResolver(TableQuery),
    defaultValues: {
      searchKeyOperator: DynamoOperatorsEnum.begins_with,
      ...tab.formState,
    },
  });

  useEffect(() => {
    return () => {
      const formState = form.getValues();
      storeTabFormState(tab.id, formState, "query");
    };
  }, [form.getValues, storeTabFormState, tab.id]);

  return (
    <Form {...form}>
      <AccountAndDatabaseBar />
      <FormContent tab={tab} />
    </Form>
  );
};

const FormContent = ({ tab }: { tab: Tab }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DynamoResults[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const { toast } = useToast();
  const { storeTabFormState } = useTabStore();

  const { control, register, handleSubmit, setValue, watch } = useFormContext<TTableQuery>();
  const activeTable = tab.table;
  const activeAWSRegion = watch("region");

  if (!activeTable) return null;

  const gsi = activeTable.indexes.gsiIndexes ?? [];
  const indexes = [activeTable.indexes.primary, ...gsi];

  const performQuery = async (nextPage?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const values = watch();
      storeTabFormState(tab.id, values, "query");

      const result = await window.api.queryTableIndex({
        ...values,
        nextPage,
      });

      setResults((prev) => (nextPage ? [...prev, result] : [result]));
      setHasMore(!!result.nextPage);
    } catch (error) {
      toast({
        title: "Query Failed",
        description: error instanceof Error ? error.message : "An error occurred while querying the table",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const lastResult = results[results.length - 1];
    if (lastResult?.nextPage) {
      performQuery(lastResult.nextPage);
    }
  };

  const onSubmit = handleSubmit(() => {
    setResults([]);
    performQuery();
  });

  const allItems = results.flatMap((r) => r.items);
  const totalScanned = results.reduce((acc, r) => acc + r.scannedCount, 0);
  const totalConsumed = results.reduce((acc, r) => acc + (r.consumedCapacity ?? 0), 0);

  return (
    <form className="flex flex-col gap-2 mt-2" onSubmit={onSubmit}>
      <input type="hidden" {...register("tableName")} value={activeTable.tableName} />
      <input type="hidden" {...register("region")} value={activeAWSRegion} />
      <input type="hidden" {...register("limit", { valueAsNumber: true })} value={50} />

      {/* Index Selection */}
      <Controller
        control={control}
        name="indexName"
        rules={{ required: true }}
        defaultValue={indexes[0].name}
        render={({ field }) => {
          return (
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
                  setValue("searchKey", index.searchKey.name);
                }}
              />
            </div>
          );
        }}
      />

      {/* Query Conditions */}
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

      <div className="flex justify-between items-center">
        <Button className="max-w-fit" size="lg" type="submit" loading={loading && results.length === 0}>
          Run Query
        </Button>

        {results.length > 0 && (
          <QueryStats
            retrievedItems={allItems.length}
            scannedItems={totalScanned}
            consumedCapacity={totalConsumed}
            queryType="query"
          />
        )}
      </div>

      {allItems.length > 0 && (
        <div className="space-y-4">
          <ResultsTable data={allItems as TableDataType[]} columns={buildColumns(allItems, { maxDepth: 1 })} />

          {hasMore && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleLoadMore} loading={loading} disabled={loading}>
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
    </form>
  );
};
