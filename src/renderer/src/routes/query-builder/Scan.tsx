import useTableStore from "@renderer/store";
import { useState } from "react";
import { Button } from "@components/Button";
import type { ScanCommandOutput } from "@aws-sdk/lib-dynamodb";

export const Scan = () => {
  const [result, setResult] = useState<ScanCommandOutput | null>(null);
  const { activeAWSRegion, activeTable } = useTableStore();

  if (!activeTable) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const limit = formData.get("limit") as string;

    const result = await window.api.scanTable({
      region: activeAWSRegion,
      tableName: activeTable.tableName,
      limit: Number.parseInt(limit),
    });

    console.log(result);

    setResult(result);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="number" name="limit" value={50} hidden />
        <Button type="submit">Scan</Button>
      </form>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};
