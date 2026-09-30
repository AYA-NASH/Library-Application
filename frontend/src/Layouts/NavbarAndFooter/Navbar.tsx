import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import Logo from "@/assets/Logo";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { NavbarProfileMenu } from "./NavbarProfileMenu";
import { NavigationLink } from "@/types/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";


const publicNavigations: NavigationLink[] = [
    { title: "Home", href: "/" },
    { title: "Browse Books", href: "/search" }
];

const authenticatedLinks: NavigationLink[] = [
    { title: "Profile", href: "#" },
    { title: "My Shelf", href: "/shelf" },
    { title: "Fees", href: "/fees" },
];

const adminLinks: NavigationLink[] = [
    {
        title: "System Dashboard",
        description: "Check System Performance and Manage different Library Aspects",
        href: "/admin-dashboard"
    }
];

function Navbar() {
    const isAdmin = useAuthStore((state) => state.user?.role === 'ADMIN');
    const isAuthenticated = useAuthStore((state) => !!state.token);

    return (
        <nav className="bg-background flex items-center justify-between px-12 py-2">
            <div className="flex gap-2">
                <Link to="/" className="shadow-xl">
                    <Logo />
                </Link>
                <NavigationMenu>
                    <NavigationMenuList>
                        {publicNavigations.map(item => (
                            <NavigationMenuItem key={item.href}>
                                <NavigationMenuLink
                                    className={`${navigationMenuTriggerStyle()} 
                                            hover:text-accent-foreground
                                        `}
                                    render={<Link to={item.href}>{item.title}</Link>}
                                />
                            </NavigationMenuItem>
                        ))}

                        {isAdmin && (
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="hover:text-accent-foreground hover:cursor-pointer"> Admin Actions </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    {adminLinks.map(item => (
                                        <NavigationMenuLink className="m-2 p-4 hover:text-accent-foreground"
                                            key={item.href}
                                            render={
                                                <Link to={item.href}>
                                                    <div className="flex flex-col gap-1 text-sm">
                                                        <div className="leading-none font-medium">
                                                            {item.title}
                                                        </div>
                                                        <div className="line-clamp-2 text-muted-foreground">
                                                            {item.description}
                                                        </div>
                                                    </div>

                                                </Link>
                                            }
                                        />
                                    ))}

                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                {isAuthenticated ? (
                    <NavbarProfileMenu authenticatedLinks={authenticatedLinks} />

                ) : (
                    <Button
                        className="p-4 font-bold"
                        nativeButton={false}
                        render={<Link to="/login">Sign In</Link>}
                    />
                )}
            </div>

        </nav>
    );
}

export default Navbar;
