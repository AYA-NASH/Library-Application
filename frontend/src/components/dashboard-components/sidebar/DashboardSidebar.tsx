import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar";

import { sidebarItems } from "@/constants/admin-dashboard/sidebarItems";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/assets/Logo";
import { useAuthStore } from "@/store/useAuthStore";
import { ShieldCheck } from "lucide-react";

export function DashboardSidebar() {
    const location = useLocation();
    const user = useAuthStore((s) => s.user);

    return (
        <Sidebar>
            <SidebarHeader className="flex items-center justify-center py-6">
                <Link to="/" className="flex flex-col items-center gap-1 no-underline">
                    <Logo className="size-14" />
                </Link>
            </SidebarHeader>

            <SidebarSeparator className="w-auto!" />

            <SidebarContent>
                <SidebarGroup>
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
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator className="w-auto!" />

            <SidebarFooter>
                <div className="flex items-center gap-3 px-3 py-2.5">
                    <ShieldCheck className="size-8 shrink-0 text-primary" />

                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-semibold text-primary">
                            {user?.username ?? "Admin"}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            {user?.email ?? "admin@bookverse.app"}
                        </span>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}