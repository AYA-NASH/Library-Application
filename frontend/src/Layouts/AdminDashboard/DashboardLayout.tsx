import { DashboardSidebar } from "@/components/dashboard-components/sidebar/DashboardSidebar";
import {
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";

import { Outlet } from "react-router-dom";

export function DashboardLayout() {
    return (
        <SidebarProvider >
            <div className="flex h-screen w-screen bg-background">
                <DashboardSidebar />
                <main className="flex flex-1 flex-col overflow-y-auto relative">
                    <div className="absolute top-6 left-2 z-50 md:block">
                        <SidebarTrigger />
                    </div>

                    <div className="flex flex-1">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}