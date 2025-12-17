import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/manager/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function ManagerLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/20">
        <AppSidebar />

        <main className="flex-1 p-6">
          <div className="flex items-center mb-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold ml-4">Dashboard</h1>
          </div>

          <div className="bg-background rounded-xl shadow-sm p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
