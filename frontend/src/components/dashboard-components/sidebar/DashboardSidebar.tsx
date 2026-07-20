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
    // const location = useLocation();
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Library Application
                    </SidebarGroupLabel>
                </SidebarGroup>

                <SidebarGroupContent>
                    <SidebarMenu>
                        {sidebarItems.map(item => {
                            return (
                                <SidebarMenuItem>
                                    <SidebarMenuButton>
                                        <Link to={item.url}>
                                            <item.icon />
                                        </Link>
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}

                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarContent>
        </Sidebar>
    )
}