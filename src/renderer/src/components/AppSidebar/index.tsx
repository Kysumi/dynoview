import { Database, User, Settings } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  Sidebar,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "../SideBar";
import { DatabaseSelector } from "./DatabaseSelector";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Database,
  },
  {
    title: "Users",
    url: "/users",
    icon: User,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div>DynoView</div>
        <DatabaseSelector />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
