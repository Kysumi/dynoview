import { AppSidebar } from "@renderer/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@renderer/components/SideBar";
import { Toaster } from "@renderer/components/Toaster";
import { Outlet } from "react-router-dom";
import { useSSO } from "@renderer/hooks/use-sso";

export const Layout = () => {
  useSSO();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col h-full w-full overflow-hidden">
        <SidebarTrigger />
        <div className="p-2">
          <Outlet />
          <Toaster />
        </div>
      </main>
    </SidebarProvider>
  );
};
