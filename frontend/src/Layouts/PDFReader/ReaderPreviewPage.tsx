import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Info } from "lucide-react";

import { useBookAccess } from "../../api/hooks/ReaderHooks/useBookAccess";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { ApiErrorDisplay } from "../Utils/ApiErrorDisplay";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { ReaderHeader } from "./components/ReaderHeader";
import { ReaderProvider } from "./components/ReaderContext";
import ReaderContainer from "./components/ReaderContainer";

export const ReaderPreviewPage = () => {
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

    const {
        data: access,
        isLoading,
        isError,
        error,
        refetch,
    } = useBookAccess(isValidBookId ? parsedBookId : NaN, "preview");

    useEffect(() => {
        if (access?.source !== "INTERNAL" && access?.url) {
            window.location.assign(access.url);
        }
    }, [access]);

    if (!isValidBookId) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
                <h1 className="text-xl font-semibold text-foreground">
                    Invalid book address
                </h1>
                <p className="max-w-md text-sm text-muted-foreground">
                    The book ID is invalid. Return to the catalog and select a
                    book to preview.
                </p>
                <Button variant="outline" onClick={() => navigate("/search")}>
                    Back to catalog
                </Button>
            </div>
        );
    }

    if (isLoading) {
        return <SpinnerLoading message="Opening preview..." />;
    }

    if (isError || !access) {
        return (
            <ApiErrorDisplay
                error={error}
                title="Preview unavailable"
                onRetry={() => void refetch()}
            />
        );
    }

    if (access.source !== "INTERNAL") {
        return <SpinnerLoading message="Redirecting to preview..." />;
    }

    if (!access.url) {
        return (
            <ApiErrorDisplay
                error={new Error("The preview URL is missing.")}
                title="Preview unavailable"
                onRetry={() => void refetch()}
            />
        );
    }

    return (
        <ReaderProvider
            bookId={parsedBookId}
            initialPage={1}
            maxAllowed={10}
        >
            <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:py-8">
                <div className="mx-auto w-full max-w-6xl space-y-5">
                    <ReaderHeader
                        title={state?.bookTitle ?? "Preview"}
                        onExit={() => navigate(-1)}
                        type="Preview"
                    />

                    <section className="space-y-4 rounded-xl border border-border/60 bg-card p-3 shadow-sm sm:p-5 lg:p-6">
                        <Alert>
                            <Info className="size-4" />
                            <AlertDescription>
                                You are viewing a limited preview. Only the
                                first 10 pages are available.
                            </AlertDescription>
                        </Alert>

                        <ReaderContainer fileUrl={access.url} />
                    </section>
                </div>
            </main>
        </ReaderProvider>
    );
};