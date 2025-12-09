import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  LayoutDashboardIcon,
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
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Inbox",
    url: "/admin/inbox",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/admin/calendar",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "/admin/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const currentPath = window.location.pathname;

  return (
    <Sidebar className="border-r bg-background">
      <SidebarContent>
        {/* BRANDING HEADER */}
        <div className="flex flex-col items-center gap-2 py-6 border-b">
          <img
            src="/logo.png"
            alt="BAKOS Logo"
            className="w-14 h-14 rounded-md object-contain shadow-sm"
          />

          <div className="text-center">
            <h1 className="text-lg font-bold tracking-tight">
              BAKOS Institute
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              System Admin Panel
            </p>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-muted-foreground px-3 mt-4">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = currentPath === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                          transition-all duration-200
                          ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }
                        `}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
