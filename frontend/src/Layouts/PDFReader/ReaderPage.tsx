import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ReaderAccessPage } from "./ReaderAccessPage";
import { ReaderPreviewPage } from "./ReaderPreviewPage";
import { useBookAccess } from "../../api/hooks/ReaderHooks/useBookAccess";
import { useReadingProgress } from "../../api/hooks/ReaderHooks/useReadingProgress";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { ReaderProvider } from "./components/ReaderContext";
import { ReaderHeader } from "./components/ReaderHeader";
import ReaderContainer from "./components/ReaderContainer";

export const ReaderPage = () => {
    const { bookId } = useParams<{ bookId: string }>();
    const navigate = useNavigate();
    const { state } = useLocation() as { state: { bookTitle?: string } };

    const { data: access, isLoading: loadingAccess } = useBookAccess(Number(bookId), "full");
    const { lastPage, isLoading: loadingProgress } = useReadingProgress(Number(bookId));

    if (loadingAccess || loadingProgress) return <SpinnerLoading />;

    if (!access || access.source !== "INTERNAL") {
        navigate(`/reader/${bookId}`);
        return null;
    }

    return (
        <ReaderProvider bookId={Number(bookId)} initialPage={lastPage} maxAllowed={0}>
            <div className="container-fluid py-4 min-vh-100 bg-light">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        <ReaderHeader title={state?.bookTitle ?? "Book"} onExit={() => navigate(-1)} type="Reader" />
                        <div className="bg-white rounded-3 shadow-sm p-4 border border-light">
                            <ReaderContainer fileUrl={access.url} />
                        </div>
                    </div>
                </div>
            </div>
        </ReaderProvider>
    );
};