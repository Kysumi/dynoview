import LeftNav from "./components/LeftNav/LeftNav";
import useTableStore from "./store";
import { QueryBuilder } from "./components/QueryBuilder/QueryBuilder";
import { SidebarProvider, SidebarTrigger } from "./components/SideBar";
import { AppSidebar } from "./components/AppSidebar";

function App(): JSX.Element {
  const { activeTable } = useTableStore();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col h-full w-full">
        <div className="h-16 bg-gray-100">
          <SidebarTrigger />
          <LeftNav />
        </div>
        <div className="p-2">{activeTable && <QueryBuilder />}</div>
      </main>
    </SidebarProvider>
  );
}

export default App;
