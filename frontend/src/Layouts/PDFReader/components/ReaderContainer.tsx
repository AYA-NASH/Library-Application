import { useEffect, useRef, useState } from "react";
import type { AccessMode, ReaderBook } from "../../../types/reader.types";
import PdfViewer from "./PdfViewer";
import { PREVIEW_MAX_PAGES } from "../../../constants/preview.config";
import { useReadingProgress } from "../../../Hooks/ReaderHooks/useReadingProgress";
import { deriveReaderCapabilities } from "../helpers/capabilityLayer";

interface ReaderContainerProps {
    book: ReaderBook;
    accessMode: AccessMode;
}

function ReaderContainer({ book, accessMode }: ReaderContainerProps) {
    const { lastPage, setLastPage } = useReadingProgress(book.id);
    const [currentPage, setCurrentPage] = useState(lastPage);
    const [totalPages, setTotalPages] = useState(0);

    const maxAllowedPage =
        accessMode === 'PREVIEW'
            ? Math.min(PREVIEW_MAX_PAGES, totalPages)
            : totalPages;

    const capabilities = deriveReaderCapabilities(
        accessMode,
        currentPage,
        maxAllowedPage
    );

    const [scrollMode, setScrollMode] = useState(capabilities.canScroll);
    const renderMode = scrollMode ? "scroll" : "page";
    const viewerRef = useRef<HTMLDivElement>(null);

    const fileUrl = book.fileUrl;

    useEffect(() => {
        if (!totalPages) return;

        if (currentPage > maxAllowedPage) {
            setCurrentPage(maxAllowedPage);
        }

        if (currentPage < 1) {
            setCurrentPage(1);
        }
    }, [currentPage, maxAllowedPage, totalPages]);

    /** Persist only validated page */
    useEffect(() => {
        if (!totalPages) return;
        setLastPage(currentPage);
    }, [currentPage, totalPages, setLastPage]);

    // Keyboard navigation
    useEffect(() => {
        if (!capabilities.canUseKeyboard) return;

        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                setCurrentPage((p) => Math.max(p - 1, 1));
            }

            if (e.key === "ArrowRight") {
                setCurrentPage((p) => Math.min(p + 1, maxAllowedPage));
            }

            if (!capabilities.canGoNext && e.key === "ArrowRight") return;

            if (!capabilities.canGoPrev && e.key === "ArrowLeft") return;

        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [capabilities.canUseKeyboard, maxAllowedPage]);

    // Scroll to current page ONLY when switching to scroll mode
    useEffect(() => {
        if (scrollMode && viewerRef.current && totalPages) {
            const pageElement = viewerRef.current.querySelector(`[data-page-number="${currentPage}"]`);
            pageElement?.scrollIntoView({ behavior: "auto", block: "start" });
        }
    }, [scrollMode, totalPages]);

    const goNext = () => {
        setCurrentPage((p) => Math.min(p + 1, maxAllowedPage));
    }

    const goPrev = () => {
        setCurrentPage((p) => Math.max(p - 1, 1));
    }

    return (
        <div className="reader-container">
            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-white rounded shadow-sm border border-light">
                <div className="d-flex align-items-center gap-3">
                    {capabilities.canScroll && (
                        <div className="form-check form-switch mb-0">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="scrollModeSwitch"
                                checked={scrollMode}
                                onChange={(e) => setScrollMode(e.target.checked)}
                            />
                            <label className="form-check-label small text-muted" htmlFor="scrollModeSwitch">
                                Continuous Scroll
                            </label>
                        </div>
                    )}

                    {capabilities.canJumpToPage && !scrollMode && (
                        <div className="d-flex align-items-center gap-2 border-start ps-3">
                            <span className="small text-muted">Go to:</span>
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                min={1}
                                max={maxAllowedPage}
                                value={currentPage}
                                onChange={(e) => {
                                    let page = Number(e.target.value);
                                    if (isNaN(page)) return;
                                    page = Math.max(1, Math.min(page, maxAllowedPage));
                                    setCurrentPage(page);
                                }}
                                style={{ width: 60 }}
                            />
                        </div>
                    )}
                </div>

                {!scrollMode && (
                    <div className="d-flex align-items-center gap-1">
                        <button
                            className="btn btn-sm btn-link text-decoration-none px-2"
                            onClick={goPrev}
                            disabled={!capabilities.canGoPrev}
                        >
                            &larr;
                        </button>
                        <span className="text-muted small fw-medium mx-1">
                            {currentPage} / {maxAllowedPage || "-"}
                        </span>
                        <button
                            className="btn btn-sm btn-link text-decoration-none px-2"
                            onClick={goNext}
                            disabled={!capabilities.canGoNext}
                        >
                            &rarr;
                        </button>
                    </div>
                )}
            </div>

            {/* PDF View Area */}
            <div className="viewer-wrapper border border-light rounded shadow-sm bg-dark p-1 mb-4 overflow-hidden">
                <PdfViewer
                    ref={viewerRef}
                    fileUrl={fileUrl}
                    currentPage={currentPage}
                    renderMode={renderMode}
                    totalPages={totalPages}
                    onLoadSuccess={(pages) => setTotalPages(pages)}
                    onVisiblePageChange={(page) => {
                        if (scrollMode) {
                            setCurrentPage(page);
                        }
                    }}
                />
            </div>

            {/* Preview notice */}
            {accessMode === "PREVIEW" && currentPage === maxAllowedPage && (
                <div className="alert alert-warning text-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Preview limit reached. Upgrade to continue reading.
                </div>
            )}
        </div>
    );
}

export default ReaderContainer;