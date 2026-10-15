import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useReadingProgress } from "../../api/hooks/ReaderHooks/useReadingProgress";
import { useBookAccess } from "../../api/hooks/ReaderHooks/useBookAccess";
import { useReaderSession } from "../../api/hooks/ReaderHooks/useReaderSession";
import { useEffect } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

import { ApiErrorDisplay } from "../Utils/ApiErrorDisplay";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, BookMarked, BookOpen, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ReaderAccessPage = () => {
    const { bookId } = useParams<{ bookId: string }>();
    const navigate = useNavigate();

    const { state } = useLocation() as {
        state: { bookTitle?: string } | null;
    };

    const parsedBookId = Number(bookId);

    const isValidBookId =
        !!bookId &&
        /^\d+$/.test(bookId) &&
        Number.isInteger(parsedBookId) &&
        parsedBookId > 0;

    const validBookId = isValidBookId ? parsedBookId : undefined;

    const {
        data: access,
        isLoading: loadingAccess,
        error: accessError,
        refetch: refetchAccess,
    } = useBookAccess(validBookId ?? NaN, "full");

    const {
        lastPage,
        isLoading: loadingProgress,
        error: progressError,
        refetch: refetchProgress,
    } = useReadingProgress(validBookId);

    const { isBookOpenElsewhere } = useReaderSession(
        validBookId?.toString(),
        false
    );

    const isExternalRedirect =
        access?.source !== "INTERNAL" && Boolean(access?.url);

    useEffect(() => {
        if (isExternalRedirect && access?.url) {
            window.location.assign(access.url);
        }
    }, [isExternalRedirect, access?.url]);

    if (!isValidBookId) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
                <Alert variant="destructive" className="max-w-lg">
                    <AlertCircle className="size-4" />
                    <AlertTitle>Invalid book address</AlertTitle>
                    <AlertDescription className="space-y-4">
                        <p>
                            The book ID in this URL is invalid. Return to the
                            catalog and select a book to continue.
                        </p>
                        <Button onClick={() => navigate("/search")}>
                            Back to catalog
                        </Button>
                    </AlertDescription>
                </Alert>
            </main>
        );
    }

    if (loadingAccess || loadingProgress) {
        return <SpinnerLoading message="Checking access..." />;
    }

    const requestError = accessError ?? progressError;

    if (requestError) {
        return (
            <ApiErrorDisplay
                error={requestError}
                title="Unable to load reader information"
                onRetry={() => {
                    void refetchAccess();
                    void refetchProgress();
                }}
            />
        );
    }

    if (isExternalRedirect) {
        return <SpinnerLoading message="Redirecting to external reader..." />;
    }

    if (!access || access.source !== "INTERNAL") {
        return (
            <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
                <Alert variant="destructive" className="max-w-lg">
                    <AlertCircle className="size-4" />
                    <AlertTitle>Reader unavailable</AlertTitle>
                    <AlertDescription className="space-y-4">
                        <p>
                            We couldn't retrieve valid access information for
                            this book. Please try again.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => void refetchAccess()}
                        >
                            Try again
                        </Button>
                    </AlertDescription>
                </Alert>
            </main>
        );
    }

    const title = state?.bookTitle ?? "Book";
    const isInProgress = lastPage > 1;

    const statusText = isBookOpenElsewhere
        ? "Reading Now"
        : isInProgress
            ? "In Progress"
            : "Not Started";

    return (
        <main className="container mx-auto max-w-3xl px-4 py-8 sm:py-12">
            <Button
                variant="ghost"
                className="-ml-3 mb-6"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="size-4" />
                Back
            </Button>

            <Card className="mx-auto max-w-xl overflow-hidden border-border/60 shadow-sm">
                <CardHeader className="items-center gap-4 border-b border-border/60 bg-muted/30 px-5 py-8 text-center sm:px-8">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        {isInProgress ? (
                            <BookMarked className="size-8" />
                        ) : (
                            <BookOpen className="size-8" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <CardTitle className="text-xl leading-snug sm:text-2xl">
                            {title}
                        </CardTitle>
                        <CardDescription>
                            Your personal reading space
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 p-5 sm:p-8">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <Badge
                            variant={
                                isBookOpenElsewhere
                                    ? "secondary"
                                    : isInProgress
                                        ? "default"
                                        : "outline"
                            }
                        >
                            {statusText}
                        </Badge>

                        {isInProgress && (
                            <Badge variant="outline">
                                Page {lastPage}
                            </Badge>
                        )}
                    </div>

                    <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-5 text-center">
                        {isBookOpenElsewhere ? (
                            <>
                                <LockKeyhole className="mx-auto mb-2 size-5 text-muted-foreground" />
                                <p className="text-sm font-medium text-foreground">
                                    This book is open in another tab
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Switch to that tab to continue reading.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-foreground">
                                    {isInProgress
                                        ? "Pick up where you left off"
                                        : "Ready to start reading?"}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {isInProgress
                                        ? `Your last saved position is page ${lastPage}.`
                                        : "Open the reader and begin your reading session."}
                                </p>
                            </>
                        )}
                    </div>

                    <Button
                        size="lg"
                        className="w-full"
                        disabled={isBookOpenElsewhere}
                        onClick={() => navigate("read", { state })}
                    >
                        <BookOpen className="size-4" />
                        {isBookOpenElsewhere
                            ? "Already Open in Another Tab"
                            : isInProgress
                                ? "Resume Reading"
                                : "Start Reading"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                        Your reading progress is saved as you read.
                    </p>
                </CardContent>
            </Card>
        </main>
    );
};