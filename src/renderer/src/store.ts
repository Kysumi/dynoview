import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import type { TableInfo } from "@shared/table-info";
import { id } from "./util/id";
import { arrayMove } from "@dnd-kit/sortable";
import type { SSOIntegration } from "@shared/sso-intefration";

interface TableState {
  setAWSRegion: (region: string) => void;
  activeAWSRegion: string;

  activeTable: TableInfo | undefined;
  setActiveTable: (table: TableInfo | undefined) => void;

  tabs: Tab[];
  addNewTab: () => void;
  removeTab: (id: string) => void;
  rearrangeTabs: (oldIndex: number, newIndex: number) => void;
  storeTabFormState: (id: string, formState: any) => void;

  integrations: SSOIntegration[];
  setIntegrations: (integrations: SSOIntegration[]) => void;
}

export interface Tab {
  id: string;
  name: string;
  sortIndex: number;
  formState: any;
}

const useTableStore = create<TableState>()(
  devtools(
    persist(
      (set) => ({
        activeTable: undefined,
        setActiveTable: (table) => set(() => ({ activeTable: table })),
        activeAWSRegion: "ap-southeast-2",
        setAWSRegion: (region) => set(() => ({ activeAWSRegion: region })),

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
        integrations: [],
        setIntegrations: (integrations) => set(() => ({ integrations })),
      }),
      {
        // persist the state to local storage
        name: "ddb-table-storage",
      },
    ),
  ),
);

export default useTableStore;
