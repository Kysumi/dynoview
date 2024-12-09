import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Tabs";
import { Query } from "./Query";
import { Scan } from "./Scan";
import type { ReactElement } from "react";
import type { QueryType } from "@renderer/store/tab-store";
import { useTab } from "@renderer/hooks/TabContext";

const tabs: { id: QueryType; label: string; content: ReactElement }[] = [
  {
    id: "query",
    label: "Query",
    content: <Query />,
  },
  {
    id: "scan",
    label: "Scan",
    content: <Scan />,
  },
];

export const QueryBuilder = () => {
  const { tab } = useTab();
  return (
    <Tabs defaultValue={tab.queryType}>
      <TabsList>
        {tabs.map((tab) => {
          return (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
