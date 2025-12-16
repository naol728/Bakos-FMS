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
  InboxIcon,
  Search,
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
  {
    title: "Dashboard",
    url: "/finance",
    icon: LayoutDashboardIcon, // main dashboard icon
  },
  {
    title: "Deposit Report",
    url: "/finance/deposit-report",
    icon: Wallet, // wallet represents deposits
  },
  {
    title: "Loan Request",
    url: "/finance/loan-report",
    icon: FileText, // file text for reports / loan forms
  },
  {
    title: "View Feedback",
    url: "/finance/view-feedback",
    icon: MessageSquare, // messages / feedback
  },
  {
    title: "Meeting Date",
    url: "/finance/meeting-date",
    icon: Calendar, // calendar for meetings
  },
  {
    title: "Settings",
    url: "/finance/settings",
    icon: Settings, // gear for settings
  },
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
              BAKOS Institute
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
                        end={item.url === "/finance"} // only use 'end' for root dashboard
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
