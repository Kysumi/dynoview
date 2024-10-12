import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

interface TableState {
  activeTable: string;
  setActiveTable: (table: string) => void;
}

const useTableStore = create<TableState>()(
  devtools(
    persist(
      (set) => ({
        activeTable: "",
        setActiveTable: (table) => set(() => ({ activeTable: table })),
      }),
      {
        name: "ddb-table-storage",
      },
    ),
  ),
);

export default useTableStore;
