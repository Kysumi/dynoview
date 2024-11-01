import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import type { TableInfo } from "@shared/table-info";

interface TableState {
  setAWSRegion: (region: string) => void;
  activeAWSRegion: string;

  activeTable: TableInfo | undefined;
  setActiveTable: (table: TableInfo | undefined) => void;
}

const useTableStore = create<TableState>()(
  devtools(
    persist(
      (set) => ({
        activeTable: undefined,
        setActiveTable: (table) => set(() => ({ activeTable: table })),
        availableTables: [],
        activeAWSRegion: "ap-southeast-2",
        setAWSRegion: (region) => set(() => ({ activeAWSRegion: region })),
      }),
      {
        // persist the state to local storage
        name: "ddb-table-storage",
      },
    ),
  ),
);

export default useTableStore;
