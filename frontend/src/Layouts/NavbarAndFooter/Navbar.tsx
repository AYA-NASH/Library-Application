import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import Logo from "@/assets/Logo";
import { NavbarProfileMenu } from "./components/NavbarProfileMenu";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DesktopNav } from "./components/DesktopNav";
import { MobileNav } from "./components/MobileNav";
import { authenticatedLinks } from "./navConfig";

function Navbar() {
    const isAdmin = useAuthStore((state) => state.user?.role === "ADMIN");
    const isAuthenticated = useAuthStore((state) => !!state.token);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2">
                        <Logo />
                    </Link>
                    <DesktopNav isAdmin={isAdmin} />
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />

                    <div className="hidden md:flex items-center">
                        {isAuthenticated ? (
                            <NavbarProfileMenu authenticatedLinks={authenticatedLinks} />
                        ) : (
                            <Button
                                className="font-bold"
                                nativeButton={false}
                                render={<Link to="/login">Sign In</Link>}
                            />
                        )}
                    </div>

                    <MobileNav
                        isOpen={mobileOpen}
                        onOpenChange={setMobileOpen}
                        isAuthenticated={isAuthenticated}
                        isAdmin={isAdmin}
                    />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;