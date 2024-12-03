import { ChevronsUpDown, DatabaseIcon } from "lucide-react";
import { useEffect, useState } from "react";
import useTableStore from "@renderer/store";
import { regions } from "@shared/available-regions";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/PopOver";
import { Button } from "@renderer/components/Button";
import { ComboBox } from "@renderer/components/ComboBox";
import { useFormContext } from "react-hook-form";
import type { TSSOuser } from "@shared/table-query";
import { Label } from "@renderer/components/Label";
import { useSSO } from "@renderer/hooks/use-sso";

export const DatabaseSelector = () => {
  const { watch } = useFormContext<TSSOuser>();
  const [tables, setTables] = useState<string[]>([]);
  useSSO();
  const { activeTable, setActiveTable, activeAWSRegion, setAWSRegion } = useTableStore();

  const accountId = watch("accountId");
  const roleName = watch("roleName");

  const loadTables = () => {
    window.api
      .listAvailableTables({ region: activeAWSRegion, accountId, roleName })
      .then(setTables)
      .catch(console.error);
  };

  /**
   * Only run on first render
   */
  useEffect(() => {
    loadTables();
  }, []);

  return (
    <div>
      <Popover
        onOpenChange={(isOpen) => {
          if (isOpen) {
            loadTables();
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button className="w-full">
            <DatabaseIcon />
            <span className="truncate">{activeTable?.tableName ?? "Select Table"}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col w-80 gap-2">
          <div className="flex flex-col gap-2">
            <Label>Table</Label>
            <ComboBox
              placeHolder="Select Table"
              selectedOption={activeTable?.tableName}
              options={tables.map((table) => ({ value: table, label: table }))}
              onChange={async (option): Promise<void> => {
                const info = await window.api.getTableInformation({
                  tableName: option.value,
                  region: activeAWSRegion,
                  accountId,
                  roleName,
                });
                setActiveTable(info);
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Region</Label>
            <ComboBox
              placeHolder="Select Region"
              selectedOption={activeAWSRegion}
              options={regions.map((region) => ({ value: region, label: region }))}
              onChange={(option) => {
                setActiveTable(undefined);
                setAWSRegion(option.value);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
