import { DashboardSidebar } from "@/components/dashboard-components/sidebar/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
    return (
        <SidebarProvider>
            <DashboardSidebar />

            <main className="relative flex flex-1 flex-col overflow-y-auto min-h-screen bg-background">
                <div className="absolute top-4 left-4 z-50 flex items-center justify-center rounded-md border border-border bg-background/80 p-1 backdrop-blur-sm shadow-sm">
                    <SidebarTrigger />
                </div>

                <div className="flex flex-1 p-6 pt-8">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    );
}