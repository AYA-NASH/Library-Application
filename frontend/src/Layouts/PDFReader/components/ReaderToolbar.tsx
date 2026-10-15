import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { useReader } from "./ReaderContext";

export const ReaderToolbar = () => {
    const {
        currentPage,
        totalPages,
        maxAllowedPage,
        goToPage,
        nextPage,
        prevPage,
        scrollMode,
        setScrollMode,
    } = useReader();

    const pageLimit = maxAllowedPage > 0 ? maxAllowedPage : totalPages;

    const handlePageChange = (value: string) => {
        if (value === "") return;

        const page = Number(value);

        if (Number.isInteger(page) && page >= 1) {
            goToPage(page);
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <Switch
                        id="reader-scroll-mode"
                        checked={scrollMode}
                        onCheckedChange={setScrollMode}
                        aria-label="Continuous scroll mode"
                    />
                    <label
                        htmlFor="reader-scroll-mode"
                        className="cursor-pointer text-sm text-muted-foreground"
                    >
                        Continuous scroll
                    </label>
                </div>

                {!scrollMode && (
                    <div className="flex items-center gap-2 border-l border-border pl-4">
                        <label
                            htmlFor="reader-page-input"
                            className="text-sm text-muted-foreground"
                        >
                            Go to page
                        </label>

                        <Input
                            id="reader-page-input"
                            type="number"
                            min={1}
                            max={pageLimit || undefined}
                            value={currentPage}
                            onChange={(event) =>
                                handlePageChange(event.target.value)
                            }
                            className="h-8 w-20"
                            aria-label="Current page number"
                        />
                    </div>
                )}
            </div>

            {!scrollMode && (
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={prevPage}
                        disabled={currentPage <= 1}
                        aria-label="Previous page"
                    >
                        <ArrowLeft className="size-4" />
                    </Button>

                    <span className="min-w-16 text-center text-sm font-medium tabular-nums text-muted-foreground">
                        {currentPage} / {pageLimit || "—"}
                    </span>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={nextPage}
                        disabled={pageLimit === 0 || currentPage >= pageLimit}
                        aria-label="Next page"
                    >
                        <ArrowRight className="size-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};