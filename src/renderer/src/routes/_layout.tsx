import { AppSidebar } from "@renderer/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@renderer/components/SideBar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col h-full w-full overflow-hidden">
        <SidebarTrigger />
        <div className="p-2">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};
