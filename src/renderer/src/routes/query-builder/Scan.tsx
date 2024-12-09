import { useEffect, useState } from "react";
import { Button } from "@components/Button";
import type { DynamoResults } from "@shared/dynamo-results";
import { useTab } from "@renderer/hooks/TabContext";
import { AccountAndDatabaseBar } from "./components/AccountAndDatabaseBar";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableScan, type TTableScan } from "@shared/table-scan";
import { useTabStore, type Tab } from "@renderer/store/tab-store";
import { Input } from "@renderer/components/Input";
import { FormItem, FormLabel } from "@renderer/components/Form";
import { ResultsTable } from "./ResultsTable";
import { buildColumns } from "./buildColumns";
import { useToast } from "@renderer/hooks/use-toast";
import type { TableDataType } from "@renderer/components/Table/TableDataType";

export const Scan = () => {
  const { tab } = useTab();
  const { storeTabFormState } = useTabStore();

  const form = useForm<TTableScan>({
    resolver: zodResolver(TableScan),
    defaultValues: {
      limit: 250,
      ...tab.formState,
    },
  });

  useEffect(() => {
    return () => {
      const formState = form.getValues();
      storeTabFormState(tab.id, formState, "scan");
    };
  }, []);

  return (
    <FormProvider {...form}>
      <AccountAndDatabaseBar />
      <FormContent tab={tab} />
    </FormProvider>
  );
};

const FormContent = ({ tab }: { tab: Tab }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DynamoResults[]>([]);
  const [hasMore, setHasMore] = useState(false);

  const { toast } = useToast();
  const { storeTabFormState } = useTabStore();

  const { register, handleSubmit, getValues } = useFormContext<TTableScan>();
  const activeTable = tab.table;

  if (!activeTable) return null;

  const performScan = async (nextPage?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const values = getValues();
      storeTabFormState(tab.id, values, "scan");

      const result = await window.api.scanTable({
        ...values,
        nextPage,
      });

      setResults((prev) => (nextPage ? [...prev, result] : [result]));
      setHasMore(!!result.nextPage);
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "An error occurred while scanning the table",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const lastResult = results[results.length - 1];
    if (lastResult?.nextPage) {
      performScan(lastResult.nextPage);
    }
  };

  const onSubmit = handleSubmit(() => {
    setResults([]);
    performScan();
  });

  const allItems = results.flatMap((r) => r.items);
  const totalScanned = results.reduce((acc, r) => acc + r.scannedCount, 0);
  const totalConsumed = results.reduce((acc, r) => acc + (r.consumedCapacity ?? 0), 0);

  return (
    <div className="space-y-4">
      <form className="space-y-4" onSubmit={onSubmit}>
        <FormItem className="max-w-sm">
          <FormLabel>Items per Page</FormLabel>
          <Input type="number" min={1} max={1000} {...register("limit", { valueAsNumber: true })} />
        </FormItem>

        <div className="flex justify-between items-center">
          <Button size="lg" type="submit" loading={loading && results.length === 0}>
            Scan
          </Button>

          {results.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Retrieved {allItems.length} items • Scanned {totalScanned} items • Consumed {totalConsumed.toFixed(2)} RCU
            </div>
          )}
        </div>
      </form>

      {allItems.length > 0 && (
        <div className="space-y-4">
          <ResultsTable
            data={allItems as TableDataType[]}
            columns={buildColumns(allItems as unknown[], { maxDepth: 1 })}
          />

          {hasMore && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleLoadMore} loading={loading} disabled={loading}>
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
