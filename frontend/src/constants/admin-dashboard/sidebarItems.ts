import { LayoutDashboard, BookOpen, ListTree, MessageSquareText } from "lucide-react";

export const sidebarItems = [
    { title: "Dashboard", url: "/admin-dashboard", icon: LayoutDashboard },
    { title: "Books", url: "/admin-dashboard/books", icon: BookOpen },
    { title: "Categories", url: "/admin-dashboard/categories", icon: ListTree },
    { title: "Messages", url: "/admin-dashboard/messages", icon: MessageSquareText },
]