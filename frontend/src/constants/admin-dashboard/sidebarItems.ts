import { LayoutDashboard, HandHelping, BookOpen, User2Icon, ListTree, MessageSquareText } from "lucide-react";

export const sidebarItems = [
    { title: "Dashboard", url: "/admin-dashboard", icon: LayoutDashboard },
    { title: "Books", url: "/admin-dashboard/books", icon: BookOpen },
    //     { title: "Categories", url: "/dashboard/categories", icon: ListTree },
    // { title: "Members", url: "/admin-dashboard/members", icon: User2Icon },
    { title: "Recent Loans", url: "/admin-dashboard/recent-loans", icon: HandHelping },
    { title: "Messages", url: "/admin-dashboard/messages", icon: MessageSquareText },
]