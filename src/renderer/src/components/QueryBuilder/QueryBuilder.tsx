import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
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
    <div>
      <Tabs items={tabs}>
        {(item) => (
          <Tab key={item.id} title={item.label}>
            <Card>
              <CardBody>{item.content}</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
};
