import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { useBookAccess } from "../../api/hooks/ReaderHooks/useBookAccess";
import { ReaderHeader } from "./components/ReaderHeader";
import { ReaderProvider } from "./components/ReaderContext";
import ReaderContainer from "./components/ReaderContainer";
import { useEffect } from "react";

import { ApiErrorDisplay } from "../Utils/ApiErrorDisplay";

export const ReaderPreviewPage = () => {
    const { bookId } = useParams<{ bookId: string }>();
    const navigate = useNavigate();
    const { state } = useLocation() as { state: { bookTitle?: string } };

    const { data: access, isLoading, isError, error, refetch } = useBookAccess(Number(bookId), "preview");

    useEffect(() => {
        if (access?.source !== "INTERNAL" && access?.url) {
            window.location.href = access.url;
        }
    }, [access]);

    if (isLoading) return <SpinnerLoading message="Opening preview..." />;
    if (isError || !access) return <ApiErrorDisplay error={error} title="Preview unavailable" onRetry={() => refetch()} />;

    if (access.source !== "INTERNAL") return <SpinnerLoading message="Redirecting..." />;

    return (
        <ReaderProvider bookId={Number(bookId)} initialPage={1} maxAllowed={10}>
            <div className="container-fluid py-4 min-vh-100 bg-light">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        <ReaderHeader title={state?.bookTitle ?? "Preview"} onExit={() => navigate(-1)} type="Preview" />
                        <div className="bg-white rounded-3 shadow-sm p-4 border border-light">
                            <div className="alert alert-info py-2 small text-center mb-3">Limited Preview Mode</div>
                            <ReaderContainer fileUrl={access.url} />
                        </div>
                    </div>
                </div>
            </div>
        </ReaderProvider>
    );
};