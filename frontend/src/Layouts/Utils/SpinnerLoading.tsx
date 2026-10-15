import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerLoadingProps {
    message?: string;
    className?: string;
    fullScreen?: boolean;
}

export const SpinnerLoading: React.FC<SpinnerLoadingProps> = ({
    message = "Loading...",
    className,
    fullScreen = false
}) => {
    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                "flex flex-col items-center justify-center gap-3 px-4 py-12 text-center",
                fullScreen ? "min-h-screen" : "min-h-[50vh]",
                className
            )}
        >
            <div className="relative flex items-center justify-center">
                {/* Subtle outer pulse effect matching primary theme */}
                <div className="absolute h-10 w-10 animate-ping rounded-full bg-primary/20 opacity-75" />
                <Loader2 className="h-8 w-8 animate-spin text-primary transition-all duration-300" />
            </div>

            {message && (
                <p className="text-sm font-medium tracking-wide text-muted-foreground animate-pulse">
                    {message}
                </p>
            )}
            <span className="sr-only">{message}</span>
        </div>
    );
};