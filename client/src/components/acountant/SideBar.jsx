import {
  Calendar,
  Settings,
  LayoutDashboardIcon,
  UserPlus,
  Users,
  UserCheck,
  Wallet,
  FileText,
  MessageSquare,
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
import { NavLink, useLocation } from "react-router-dom";

const items = [
  { title: "Manage Customer", url: "/accountant", icon: Users },
  {
    title: "Register Customer",
    url: "/accountant/registercustomer",
    icon: Users,
  },
  {
    title: "Manage  Loan",
    url: "/accountant/manage-loan",
    icon: UserCheck,
  },
  { title: "Meeting Dates", url: "/accountant/meeting-date", icon: Calendar },

  {
    title: "Deposit & Saving ",
    url: "/accountant/deposit-save-manage",
    icon: Calendar,
  },
  { title: "Feedbacks", url: "/accountant/view-feedback", icon: MessageSquare },

  { title: "Settings", url: "/accountant/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

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
              BAKOS Saving & Credit Service
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              System Admin Panel
            </p>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mt-4 text-sm font-semibold text-muted-foreground">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin"} // only use 'end' for root dashboard
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                          transition-all duration-200
                          ${
                            isActive
                              ? "bg-primary/15 text-primary shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }
                        `}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
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
