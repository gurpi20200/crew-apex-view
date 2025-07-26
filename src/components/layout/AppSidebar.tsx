import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Shield,
  Settings,
  Activity,
  Layers,
  User,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Portfolio", url: "/portfolio", icon: PieChart },
  { title: "Trading Signals", url: "/signals", icon: TrendingUp },
  { title: "Risk Management", url: "/risk", icon: Shield },
  { title: "Performance", url: "/performance", icon: Activity },
  { title: "Strategies", url: "/strategies", icon: Layers },
  { title: "System Health", url: "/health", icon: AlertTriangle },
];

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive: active }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
      active
        ? "bg-primary text-primary-foreground shadow-md"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    }`;

  return (
    <Sidebar
      className={`${
        collapsed ? "w-16" : "w-64"
      } border-r border-sidebar-border bg-sidebar transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="p-4">
        {/* Logo Section */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-white">
            <DollarSign className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-sidebar-foreground">
                CrewAI
              </span>
              <span className="text-sm text-sidebar-foreground/70">
                Trading Bot
              </span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Trading
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-0">
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={getNavCls({ isActive: isActive(item.url) })}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-0">
                    <NavLink
                      to={item.url}
                      className={getNavCls({ isActive: isActive(item.url) })}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}