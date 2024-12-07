import { Database, Settings, Package, Home } from "lucide-react";
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
import Versions from "../Versions";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Query Builder",
    url: "/query-builder",
    icon: Database,
  },
  {
    title: "Models",
    url: "/models",
    icon: Package,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export const AppSidebar = () => {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarHeader className="font-semibold">DynoView</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton variant={"default"} isActive={item.url === location.pathname} asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
        <Versions />
      </SidebarFooter>
    </Sidebar>
  );
};
