import { DashboardSidebar } from "@/components/dashboard-components/sidebar/DashboardSidebar";
import {
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";

import { Outlet } from "react-router-dom";

export function DashboardLayout() {
    return (
        <SidebarProvider >

            <DashboardSidebar />
            <main >
                <div >
                    <SidebarTrigger />
                </div>

                <div>
                    <Outlet />
                </div>
            </main>

        </SidebarProvider>
    )
}