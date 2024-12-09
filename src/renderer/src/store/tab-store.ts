import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { arrayMove } from "@dnd-kit/sortable";
import type { TableInfo } from "@shared/table-info";
import { id } from "@renderer/util/id";

interface TableState {
  tabs: Tab[];
  addNewTab: () => void;
  removeTab: (id: string) => void;
  rearrangeTabs: (oldIndex: number, newIndex: number) => void;
  storeTabFormState: (id: string, formState: Record<string, unknown>, queryType: QueryType) => void;
  updateTab: (id: string, updates: Partial<Omit<Tab, "id">>) => void;
}
export type QueryType = "query" | "scan";

export interface Tab {
  id: string;
  name: string;
  sortIndex: number;
  formState: Record<string, unknown>;
  table?: TableInfo;
  queryType: QueryType;
}

const defaultTabName = "New tab";

export const useTabStore = create<TableState>()(
  devtools(
    persist(
      (set) => ({
        tabs: [{ id: id(), name: "Your first tab", sortIndex: 0, formState: {}, queryType: "query" }],
        addNewTab: () =>
          set((state) => {
            // get the count of tabs with the name New Tab
            const tabs = state.tabs.filter((tab) => tab.name.includes(defaultTabName));
            console.log(tabs, state.tabs);

            return {
              tabs: [
                ...state.tabs,
                {
                  id: id(),
                  name: `${defaultTabName}${tabs.length === 0 ? "" : ` (${tabs.length})`}`,
                  sortIndex: state.tabs.length,
                  formState: {},
                  queryType: "query",
                },
              ],
            };
          }),
        rearrangeTabs: (oldIndex, newIndex) => {
          set((state) => {
            const tabs = arrayMove(state.tabs, oldIndex, newIndex);
            return { tabs };
          });
        },
        removeTab: (id) =>
          set((state) => {
            const tabs = state.tabs.filter((tab) => tab.id !== id);
            return { tabs };
          }),
        updateTab: (id, updates) =>
          set((state) => ({
            tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, ...updates } : tab)),
          })),
        storeTabFormState: (id, formState, queryType) =>
          set((state) => {
            const tabs = state.tabs.map((tab) => {
              if (tab.id === id) {
                return { ...tab, formState, queryType };
              }
              return tab;
            });
            return { tabs };
          }),
      }),
      {
        // persist the state to local storage
        name: "ddb-table-storage",
      },
    ),
  ),
);
