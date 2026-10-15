import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useBookAccess } from "../../api/hooks/ReaderHooks/useBookAccess";
import { useReadingProgress } from "../../api/hooks/ReaderHooks/useReadingProgress";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { ReaderProvider } from "./components/ReaderContext";
import { ReaderHeader } from "./components/ReaderHeader";
import ReaderContainer from "./components/ReaderContainer";
import { ApiErrorDisplay } from "../Utils/ApiErrorDisplay";
import { useEffect } from "react";

export const ReaderPage = () => {
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

    const shouldReturnToAccessPage =
        !loadingAccess &&
        !accessError &&
        (!access || access.source !== "INTERNAL");

    useEffect(() => {
        if (shouldReturnToAccessPage && isValidBookId) {
            navigate(`/reader/${bookId}`, { replace: true });
        }
    }, [shouldReturnToAccessPage, isValidBookId, bookId, navigate]);

    if (!isValidBookId) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
                <h1 className="text-xl font-semibold text-foreground">
                    Invalid book address
                </h1>
                <p className="max-w-md text-sm text-muted-foreground">
                    The book ID is invalid. Return to the catalog and select a
                    book to continue.
                </p>
                <button
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                    onClick={() => navigate("/search")}
                >
                    Back to catalog
                </button>
            </div>
        );
    }

    if (loadingAccess || loadingProgress) {
        return <SpinnerLoading message="Loading reader..." />;
    }

    const requestError = accessError ?? progressError;

    if (requestError) {
        return (
            <ApiErrorDisplay
                error={requestError}
                title="Unable to load reader"
                onRetry={() => {
                    void refetchAccess();
                    void refetchProgress();
                }}
            />
        );
    }

    if (!access || access.source !== "INTERNAL") {
        return <SpinnerLoading message="Returning to reader access..." />;
    }

    return (
        <ReaderProvider
            bookId={parsedBookId}
            initialPage={lastPage}
            maxAllowed={0}
        >
            <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:py-8">
                <div className="mx-auto w-full max-w-6xl space-y-5">
                    <ReaderHeader
                        title={state?.bookTitle ?? "Book"}
                        onExit={() => navigate(-1)}
                        type="Reader"
                    />

                    <section className="overflow-hidden rounded-xl border border-border/60 bg-card p-3 shadow-sm sm:p-5 lg:p-6">
                        <ReaderContainer fileUrl={access.url} />
                    </section>
                </div>
            </main>
        </ReaderProvider>
    );
};