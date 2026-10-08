import {
    HelpCircleIcon,
    LogOutIcon,
    Settings
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import user_avatar from "@/Images/user_avatar.jpg";
import { useAuthActions } from "@/api/hooks/useAuthActions";
import { NavigationLink } from "@/types/navigation";
import { Link } from "react-router-dom";


type NavbarProfileMenuProps = {
    authenticatedLinks: NavigationLink[];
};

export function NavbarProfileMenu({
    authenticatedLinks,
}: NavbarProfileMenuProps) {
    const { logout } = useAuthActions();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={
                <Button variant="ghost" size="icon" className="rounded-full hover:cursor-pointer">
                    <Avatar>
                        <AvatarImage src={user_avatar} alt="user avatar" />
                        <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                </Button>
            } />

            <DropdownMenuContent className="w-72">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    {authenticatedLinks.map(item => (
                        <DropdownMenuItem key={item.href}
                            render={
                                <Link to={item.href}>
                                    {item.title}
                                </Link>
                            }
                        />

                    ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                    <HelpCircleIcon />
                    Help & Support
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings />
                    Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem variant="destructive"
                    onClick={logout}
                >
                    <LogOutIcon />
                    Log out
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}