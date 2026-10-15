import { ArrowLeft, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ReaderHeaderProps {
    title: string;
    onExit: () => void;
    type: "Reader" | "Preview";
}

export const ReaderHeader = ({
    title,
    onExit,
    type,
}: ReaderHeaderProps) => {
    const isPreview = type === "Preview";

    return (
        <header className="flex min-w-0 items-center justify-between gap-4">
            <div className="min-w-0 space-y-1">
                <button
                    type="button"
                    onClick={onExit}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Back
                </button>

                <div className="flex min-w-0 items-center gap-2">
                    <h1
                        className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                        title={title}
                    >
                        {title}
                    </h1>
                    <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        {type}
                    </span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onExit}
                className="shrink-0 gap-2"
            >
                <X className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">
                    {isPreview ? "Close Preview" : "Exit Reader"}
                </span>
                <span className="sm:hidden">Exit</span>
            </Button>
        </header>
    );
};