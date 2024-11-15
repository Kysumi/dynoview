import { Database as DatabaseIcon } from "lucide-react";
import useTableStore from "../../store";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@renderer/components/Sheet";
import { useEffect, useState } from "react";
import { regions } from "@shared/available-regions";
import Versions from "../Versions";
import { Button } from "../Button";
import { ComboBox } from "../ComboBox";

export default function LeftNav() {
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
    <div className="flex">
      <Sheet modal={false}>
        <SheetTrigger asChild>
          <Button>
            <DatabaseIcon />
            {activeTable?.tableName ?? "Select Table"}
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="flex flex-col gap-4 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Configuration</SheetTitle>
            <SheetDescription>Change Paramaters</SheetDescription>
          </SheetHeader>

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

          <ComboBox
            placeHolder="Select Region"
            selectedOption={activeAWSRegion}
            options={regions.map((region) => ({ value: region, label: region }))}
            onChange={(option) => {
              setActiveTable(undefined);
              setAWSRegion(option.value);
            }}
          />

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{activeTable?.tableName}</h3>
            <pre className="text-sm">{JSON.stringify(activeTable?.indexes, null, 2)}</pre>
          </div>
          <Versions />
        </SheetContent>
      </Sheet>
    </div>
  );
}
