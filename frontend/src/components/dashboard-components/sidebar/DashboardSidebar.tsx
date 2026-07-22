import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";

import { sidebarItems } from "@/constants/admin-dashboard/sidebarItems";
import { Link, useLocation } from "react-router-dom";

export function DashboardSidebar() {
    const location = useLocation();
    return (
        <Sidebar>
            <SidebarContent className="p-3">
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Library Application
                    </SidebarGroupLabel>
                </SidebarGroup>

                <SidebarGroupContent>
                    <SidebarMenu>
                        {sidebarItems.map((item) => {
                            const isActive =
                                item.url === "/admin-dashboard"
                                    ? location.pathname === item.url
                                    : location.pathname.startsWith(item.url);

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        isActive={isActive}
                                        className="gap-3 m-1"
                                        render={
                                            <Link to={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        }
                                    />
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarContent>
        </Sidebar>
    )
}