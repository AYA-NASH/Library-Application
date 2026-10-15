import React from "react";
import { FallbackProps } from "react-error-boundary";
import { AlertTriangle, RefreshCw, Home, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const GlobalErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
    const [showDetails, setShowDetails] = React.useState(false);

    return (
        <div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center px-4 py-12 sm:px-6">
            <Card className="w-full max-w-lg border-destructive/30 bg-card/95 shadow-xl backdrop-blur-md">
                <CardContent className="flex flex-col items-center p-6 sm:p-8 text-center">
                    {/* Error Icon Badge */}
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-8 ring-destructive/5">
                        <AlertTriangle className="h-8 w-8" />
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Unexpected Application Error
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Something went wrong while rendering this page. Your saved data is intact, but the current view needs to be restarted.
                    </p>

                    {/* Collapsible Error Technical Details */}
                    {error?.message && (
                        <div className="mt-6 w-full text-left">
                            <button
                                type="button"
                                onClick={() => setShowDetails((prev) => !prev)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`} />
                                {showDetails ? "Hide Error Details" : "View Technical Details"}
                            </button>

                            {showDetails && (
                                <div className="mt-2 rounded-lg border border-border bg-muted/40 p-3 text-xs font-mono text-destructive break-words overflow-auto max-h-40">
                                    {error.message}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                        <Button
                            variant="destructive"
                            size="lg"
                            onClick={resetErrorBoundary}
                            className="w-full font-semibold shadow-sm hover:cursor-pointer flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try to Recover
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full font-medium"
                            nativeButton={false}
                            render={
                                <a href="/" className="flex items-center justify-center gap-2">
                                    <Home className="h-4 w-4" />
                                    Go to Homepage
                                </a>
                            }
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
