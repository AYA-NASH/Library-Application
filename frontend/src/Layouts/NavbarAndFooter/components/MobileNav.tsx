import { Link, useLocation } from "react-router-dom";
import Logo from "@/assets/Logo";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu, ShieldAlert, BookOpen, Home, Layers, Receipt } from "lucide-react";
import { NavbarProfileMenu } from "./NavbarProfileMenu";
import { authenticatedLinks } from "../navConfig";

interface MobileNavProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

export function MobileNav({
    isOpen,
    onOpenChange,
    isAuthenticated,
    isAdmin
}: MobileNavProps) {
    const location = useLocation();

    return (
        <div className="flex items-center md:hidden">
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetTrigger render={
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Open navigation menu"
                        className="hover:bg-accent"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                }
                />

                <SheetContent side="right" className="flex w-75 flex-col justify-between p-0 sm:w-90">
                    <div className="p-6">
                        <SheetHeader className="p-0 text-left">
                            <SheetTitle className="flex items-center gap-2">
                                <Logo />
                            </SheetTitle>
                        </SheetHeader>

                        <div className="mt-8 flex flex-col gap-1">
                            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Navigation
                            </div>

                            <SheetClose render={
                                <Link
                                    to="/"
                                    onClick={() => onOpenChange(false)}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                        location.pathname === "/"
                                            ? "bg-primary font-semibold text-primary-foreground"
                                            : "text-foreground hover:bg-muted"
                                    }`}
                                >
                                    <Home className="h-4 w-4" />
                                    Home
                                </Link>
                            } />

                            <SheetClose render={
                                <Link
                                    to="/search"
                                    onClick={() => onOpenChange(false)}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                        location.pathname.startsWith("/search")
                                            ? "bg-primary font-semibold text-primary-foreground"
                                            : "text-foreground hover:bg-muted"
                                    }`}
                                >
                                    <BookOpen className="h-4 w-4" />
                                    Browse Books
                                </Link>
                            } />

                            {isAuthenticated && (
                                <>
                                    <Separator className="my-3" />
                                    <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Library Shelf
                                    </div>

                                    <SheetClose render={
                                        <Link
                                            to="/shelf"
                                            onClick={() => onOpenChange(false)}
                                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                                location.pathname.startsWith("/shelf")
                                                    ? "bg-primary font-semibold text-primary-foreground"
                                                    : "text-foreground hover:bg-muted"
                                            }`}
                                        >
                                            <Layers className="h-4 w-4" />
                                            My Shelf
                                        </Link>
                                    } />

                                    <SheetClose render={
                                        <Link
                                            to="/fees"
                                            onClick={() => onOpenChange(false)}
                                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                                location.pathname.startsWith("/fees")
                                                    ? "bg-primary font-semibold text-primary-foreground"
                                                    : "text-foreground hover:bg-muted"
                                            }`}
                                        >
                                            <Receipt className="h-4 w-4" />
                                            Fees
                                        </Link>
                                    } />
                                </>
                            )}

                            {isAdmin && (
                                <>
                                    <Separator className="my-3" />
                                    <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Administration
                                    </div>

                                    <SheetClose render={
                                        <Link
                                            to="/admin-dashboard"
                                            onClick={() => onOpenChange(false)}
                                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                                location.pathname.startsWith("/admin-dashboard")
                                                    ? "bg-primary font-semibold text-primary-foreground"
                                                    : "text-foreground hover:bg-muted"
                                            }`}
                                        >
                                            <ShieldAlert className="h-4 w-4" />
                                            System Dashboard
                                        </Link>
                                    } />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Bottom Section (Auth/Profile) */}
                    <div className="border-t border-border bg-muted/20 p-4">
                        {isAuthenticated ? (
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">Logged in</span>
                                <NavbarProfileMenu authenticatedLinks={authenticatedLinks} />
                            </div>
                        ) : (
                            <SheetClose render={
                                <Link to="/login" onClick={() => onOpenChange(false)} className="w-full">
                                    <Button className="w-full font-bold">
                                        Sign In
                                    </Button>
                                </Link>
                            } />
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

