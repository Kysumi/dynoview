import { useState } from "react";
import { Button } from "@components/Button";
import type { ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { useTab } from "@renderer/hooks/TabContext";
import { AccountAndDatabaseBar } from "./components/AccountAndDatabaseBar";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableScan, type TTableScan } from "@shared/table-scan";
import type { Tab } from "@renderer/store/tab-store";
import { Input } from "@renderer/components/Input";
import { FormItem, FormLabel } from "@renderer/components/Form";

export const Scan = () => {
  const { tab } = useTab();

  const form = useForm<TTableScan>({
    resolver: zodResolver(TableScan),
    defaultValues: {
      limit: 250,
      ...tab.formState,
    },
  });

  return (
    <FormProvider {...form}>
      <AccountAndDatabaseBar />
      <FormContent tab={tab} />
    </FormProvider>
  );
};

const FormContent = ({ tab }: { tab: Tab }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanCommandOutput | null>(null);

  const { register, handleSubmit } = useFormContext<TTableScan>();
  const activeTable = tab.table;

  if (!activeTable) return null;

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);

    const result = await window.api.scanTable(data).catch(() => {
      return null;
    });

    setResult(result);
    setLoading(false);
  });

  return (
    <>
      <form className="flex flex-col gap-2 mt-2" onSubmit={onSubmit}>
        <FormItem className="max-w-sm">
          <FormLabel>Limit</FormLabel>
          <Input type="number" {...register("limit")} />
        </FormItem>

        <Button className="max-w-fit" size={"lg"} type="submit" loading={loading}>
          Scan
        </Button>
      </form>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </>
  );
};
