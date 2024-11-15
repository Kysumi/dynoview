import { SidebarContent, SidebarGroup, SidebarFooter, Sidebar, SidebarHeader } from "../SideBar";

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
