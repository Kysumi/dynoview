import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { Database } from "lucide-react";
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

export default function LeftNav() {
  const [tables, setTables] = useState<string[]>([]);
  const { activeTable, setActiveTable, activeAWSRegion, setAWSRegion } = useTableStore();

  const listTables = async () => {
    const tables = await window.api.listAvailableTables({ region: activeAWSRegion });
    return tables;
  };

  useEffect(() => {
    listTables().then((tables) => setTables(tables));
  }, [activeAWSRegion]);

  return (
    <div className="flex items-center px-4">
      <Sheet modal={false}>
        <SheetTrigger asChild>
          <Button>
            <Database />
            {activeTable?.tableName ?? "Select Table"}
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Configuration</SheetTitle>
            <SheetDescription>Change Paramaters</SheetDescription>
            <Autocomplete
              key="tableSelector"
              label="Active Table"
              className="max-w-xs"
              isClearable={false}
              selectedKey={activeTable?.tableName ?? null}
              onSelectionChange={async (e) => {
                if (e?.toString()) {
                  const info = await window.api.getTableInformation({
                    tableName: e.toString(),
                    region: activeAWSRegion,
                  });
                  setActiveTable(info);
                }
              }}
            >
              {tables.map((table) => (
                <AutocompleteItem key={table} value={table}>
                  {table}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <Autocomplete
              key="regionSelector"
              label="AWS Region"
              className="max-w-xs"
              isClearable={false}
              selectedKey={activeAWSRegion}
              onSelectionChange={(e) => {
                if (e?.toString()) {
                  setActiveTable(undefined);
                  setAWSRegion(e.toString());
                }
              }}
            >
              {regions.map((region) => (
                <AutocompleteItem key={region} value={region}>
                  {region}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
