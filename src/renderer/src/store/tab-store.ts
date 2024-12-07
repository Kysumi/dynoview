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
  storeTabFormState: (id: string, formState: Record<string, unknown>) => void;
  updateTab: (id: string, updates: Partial<Omit<Tab, "id">>) => void;
}

export interface Tab {
  id: string;
  name: string;
  sortIndex: number;
  formState: Record<string, unknown>;
  table?: TableInfo;
  awsRegion: string;
}

export const useTabStore = create<TableState>()(
  devtools(
    persist(
      (set) => ({
        tabs: [{ id: id(), name: "Your first tab", sortIndex: 0, formState: {} }],
        addNewTab: () =>
          set((state) => ({
            tabs: [...state.tabs, { id: id(), name: "New tab", sortIndex: state.tabs.length, formState: {} }],
          })),
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
        storeTabFormState: (id, formState) =>
          set((state) => {
            const tabs = state.tabs.map((tab) => {
              if (tab.id === id) {
                return { ...tab, formState };
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
