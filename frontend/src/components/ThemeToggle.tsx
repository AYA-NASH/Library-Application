import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme") === "dark" ||
            (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="h-9 w-9 border-border bg-background hover:bg-accent text-foreground"
            aria-label="Toggle theme"
        >
            {isDark ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
    );
}