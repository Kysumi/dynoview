import Versions from "./components/Versions";
import { useState, useEffect } from "react";
import useTableStore from "./store";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./components/Sheet";
import { regions } from "../../preload/ddb/config";

function App(): JSX.Element {
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
    <div>
      <div className="h-16 bg-gray-100">
        <div className="flex items-center px-4">
          <Sheet modal={false}>
            <SheetTrigger asChild>
              <Button>Open</Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Configuration</SheetTitle>
                <SheetDescription>Change Paramaters</SheetDescription>
                <Autocomplete
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
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{activeTable?.tableName}</h3>
          <pre className="text-sm">{JSON.stringify(activeTable?.indexes, null, 2)}</pre>
        </div>
        <Versions />
      </div>
    </div>
  );
}

export default App;
