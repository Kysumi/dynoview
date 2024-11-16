import { ChevronsUpDown, DatabaseIcon } from "lucide-react";
import { Button } from "../Button";
import { Popover, PopoverContent, PopoverTrigger } from "../PopOver";
import { useEffect, useState } from "react";
import useTableStore from "@renderer/store";
import { ComboBox } from "../ComboBox";
import { regions } from "@shared/available-regions";
import { Label } from "../Label";

export const DatabaseSelector = () => {
  const [tables, setTables] = useState<string[]>([]);
  const { activeTable, setActiveTable, activeAWSRegion, setAWSRegion } = useTableStore();

  const listTables = async () => {
    const tables = await window.api.listAvailableTables({ region: activeAWSRegion });
    return tables;
  };

  // biome-ignore lint: We don't want to watch for table changes
  useEffect(() => {
    listTables().then((tables) => setTables(tables));
  }, [activeAWSRegion]);

  return (
    <div>
      <Popover>
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
