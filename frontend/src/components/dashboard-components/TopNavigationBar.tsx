import { Bell, UserRound } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

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
    return (
        <header
            className={`flex items-center ${containHeader ? "justify-between" : "justify-end"
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

            <div className="flex items-center gap-4 text-muted-foreground">
                {/* Future Search Bar */}

                <Bell className="h-5 w-5 cursor-pointer transition-colors hover:text-foreground" />

                <UserRound className="h-5 w-5 cursor-pointer transition-colors hover:text-foreground" />

                <ThemeToggle />
            </div>
        </header>
    );
}