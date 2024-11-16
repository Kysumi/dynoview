import type { Tab } from "@renderer/store";
import { createContext, type ReactNode, useContext } from "react";

interface TabContextType {
  tab: Tab;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

interface TabProviderProps {
  children: ReactNode;
  value: TabContextType;
}

export const TabProvider = ({ children, value }: TabProviderProps) => {
  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};

export const useTab = () => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error("useTab must be used within a TabProvider");
  }
  return context;
};
