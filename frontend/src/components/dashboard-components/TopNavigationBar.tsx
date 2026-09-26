import { LogOut, Settings, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthActions } from "@/api/hooks/useAuthActions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TopNavigationBarProps {
    containHeader?: boolean;
    header?: string;
    subDescription?: string;
}

export function TopNavigationBar({
    containHeader = false,
    header,
    subDescription,
}: TopNavigationBarProps) {
    const user = useAuthStore((s) => s.user);
    const { logout } = useAuthActions();

    const initials = user?.username
        ? user.username
              .split(" ")
              .map((w) => w[0]?.toUpperCase())
              .slice(0, 2)
              .join("")
        : "A";

    return (
        <header
            className={`flex items-center ${
                containHeader ? "justify-between" : "justify-end"
            }`}
        >
            {containHeader && (
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {header}
                    </h1>
                    {subDescription && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {subDescription}
                        </p>
                    )}
                </div>
            )}

            <div className="flex items-center gap-3 text-muted-foreground">
                <ThemeToggle />

                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="cursor-pointer rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label="Admin menu"
                    >
                        <Avatar size="default">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-52">
                        <div className="px-3 py-2">
                            <div className="flex items-center gap-2 mb-0.5">
                                <ShieldCheck className="size-3.5 text-primary" />
                                <span className="text-xs font-semibold text-primary">
                                    Administrator
                                </span>
                            </div>
                            <p className="truncate text-sm font-medium text-foreground">
                                {user?.username ?? "Admin"}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {user?.email ?? ""}
                            </p>
                        </div>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Settings className="size-4" />
                            Settings
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                            onClick={logout}
                        >
                            <LogOut className="size-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}