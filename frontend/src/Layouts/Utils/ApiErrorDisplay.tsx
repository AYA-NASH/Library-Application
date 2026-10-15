import { ApiError } from "../../errors/ApiError";
import { parseApiError } from "../../errors/parseApiError";
import { AlertCircle, AlertTriangle, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
    error: unknown;
    title?: string;
    showStatusCode?: boolean;
    onRetry?: () => void;
}

const ErrorDetailItem = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-2 text-xs">
            <span className="font-semibold text-muted-foreground shrink-0">{label}:</span>
            <span className="font-mono text-foreground break-all">{value}</span>
        </div>
    );
};

export const ApiErrorDisplay = ({
    error,
    title = "Something went wrong",
    showStatusCode = true,
    onRetry,
}: Props) => {
    const api: ApiError = parseApiError(error);

    // 401 Unauthorized handling
    if (api.status === 401) {
        return (
            <div className="mx-auto w-full max-w-md px-4 py-8">
                <Alert className="border-warning/30 bg-warning/10 text-warning-foreground">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <AlertTitle className="font-semibold text-warning">Session Expired</AlertTitle>
                    <AlertDescription className="text-warning-foreground/90">
                        Redirecting to login...
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // 403 Forbidden handling
    if (api.status === 403) {
        return (
            <div className="mx-auto w-full max-w-md px-4 py-8">
                <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                    <Lock className="h-5 w-5 text-destructive" />
                    <AlertTitle className="font-semibold text-destructive">Access Restricted</AlertTitle>
                    <AlertDescription>
                        Forbidden. You do not have permission to perform this action.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-lg px-4 py-8">
            <Card className="border-destructive/30 bg-card shadow-md">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="text-base font-bold text-destructive">
                                    {title}
                                </h3>
                                {showStatusCode && api.status ? (
                                    <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                                        HTTP {api.status}
                                    </span>
                                ) : null}
                            </div>

                            <p className="mt-2 text-sm leading-relaxed text-foreground/90 break-words">
                                {api.message}
                            </p>

                            {/* Validation Errors detail */}
                            {api.validationErrors && Object.keys(api.validationErrors).length > 0 && (
                                <div className="mt-4 rounded-lg border border-border/80 bg-muted/30 p-3">
                                    <div className="text-xs font-semibold text-muted-foreground mb-2">
                                        Validation Details:
                                    </div>
                                    <ul className="space-y-1 text-xs">
                                        {Object.entries(api.validationErrors).map(([field, msg]) => (
                                            <li key={field} className="flex gap-1.5">
                                                <span className="font-semibold text-foreground">{field}:</span>
                                                <span className="text-muted-foreground">{msg}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Path and context */}
                            {api.path && (
                                <div className="mt-3">
                                    <ErrorDetailItem label="Endpoint" value={api.path} />
                                </div>
                            )}

                            {/* Retry CTA */}
                            {onRetry && (
                                <div className="mt-6">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={onRetry}
                                        className="w-full sm:w-auto font-medium hover:cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw className="h-3.5 w-3.5" />
                                        Try Again
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
