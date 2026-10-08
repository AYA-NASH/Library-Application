import { Link } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { publicNavigations, adminLinks } from "../navConfig";

interface DesktopNavProps {
    isAdmin: boolean;
}

export function DesktopNav({ isAdmin }: DesktopNavProps) {
    return (
        <div className="hidden md:flex">
            <NavigationMenu>
                <NavigationMenuList>
                    {publicNavigations.map((item) => (
                        <NavigationMenuItem key={item.href}>
                            <NavigationMenuLink
                                className={`${navigationMenuTriggerStyle()} hover:text-accent-foreground`}
                                render={<Link to={item.href}>{item.title}</Link>}
                            />
                        </NavigationMenuItem>
                    ))}

                    {isAdmin && (
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="hover:text-accent-foreground hover:cursor-pointer">
                                Admin Actions
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                {adminLinks.map((item) => (
                                    <NavigationMenuLink
                                        className="m-2 block p-4 hover:text-accent-foreground"
                                        key={item.href}
                                        render={
                                            <Link to={item.href}>
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <div className="font-medium leading-none">
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
    );
}

