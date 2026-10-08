import { NavigationLink } from "@/types/navigation";

export const publicNavigations: NavigationLink[] = [
    { title: "Home", href: "/" },
    { title: "Browse Books", href: "/search" }
];

export const authenticatedLinks: NavigationLink[] = [
    { title: "Profile", href: "#" },
    { title: "My Shelf", href: "/shelf" },
    { title: "Fees", href: "/fees" },
];

export const adminLinks: NavigationLink[] = [
    {
        title: "System Dashboard",
        description: "Check System Performance and Manage different Library Aspects",
        href: "/admin-dashboard"
    }
];

