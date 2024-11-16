import { SidebarProvider, SidebarTrigger } from "./components/SideBar";
import { AppSidebar } from "./components/AppSidebar";
import { PageTabs } from "./components/PageTab";

function App(): JSX.Element {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col h-full w-full overflow-hidden">
        <div className="bg-gray-100">
          <SidebarTrigger />
        </div>
        <div className="p-2">
          <PageTabs />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default App;
