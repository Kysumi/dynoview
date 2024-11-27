import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Tabs";
import { Query } from "./Query";
import { Scan } from "./Scan";

const tabs = [
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
  return (
    <Tabs defaultValue="query">
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
