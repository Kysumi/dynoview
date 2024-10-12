import Versions from "./components/Versions";
import { useState, useEffect } from "react";
import { Button, Select, Title, Text, AppShell, Group, Burger } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { TableInfo } from "src/preload/ddb/operations/get-table-information";
import { useDisclosure } from "@mantine/hooks";

function App(): JSX.Element {
  const [opened, { toggle }] = useDisclosure();
  const form = useForm({
    initialValues: {
      table: "",
    },
    validate: {
      table: (value) => (value === "" ? "Table is required" : null),
    },
  });

  const listTables = async () => {
    const tables = await window.api.listAvailableTables({ region: "ap-southeast-2" });
    return tables;
  };

  const [tables, setTables] = useState<string[]>([]);
  const [tableInfo, setTableInfo] = useState<TableInfo | undefined>();

  const { activeTable, setActiveTable } = useTableStore();

  useEffect(() => {
    if (tables.length === 0) {
      listTables().then((tables) => setTables(tables));
    }
  }, [tables]);

  const handleSubmit = async (values: typeof form.values) => {
    const info = await window.api.getTableInformation({ tableName: values.table, region: "ap-southeast-2" });
    setTableInfo(info);
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          Hi?
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="gray" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Select label="Active Table" placeholder="Select a table" data={tables} />

        <div className="flex flex-col gap-2">
          <Title order={3}>{tableInfo?.tableName}</Title>
          <Text fz="md" lh="md">
            {JSON.stringify(tableInfo?.indexes)}
          </Text>
        </div>
        <Versions />
      </AppShell.Navbar>
      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}

export default App;
