import { useEffect, useRef } from "react";

import { useReader } from "./ReaderContext";
import { useReaderKeyboard } from "./useReaderKeyboard";
import { ReaderToolbar } from "./ReaderToolbar";
import PdfViewer from "./PdfViewer";
import { useBlobCleanup } from "./useBlobCleanup";



const ReaderContainer = ({ fileUrl }: { fileUrl: string }) => {
    const {
        currentPage, totalPages, setTotalPages,
        scrollMode, goToPage
    } = useReader();

    const viewerRef = useRef<HTMLDivElement>(null);

    useBlobCleanup(fileUrl);
    
    useReaderKeyboard();

    useEffect(() => {
        if (scrollMode && viewerRef.current) {
            const pageElement = viewerRef.current.querySelector(`[data-page-number="${currentPage}"]`);
            pageElement?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [currentPage, scrollMode]);

    return (
        <div className="reader-container">
            <ReaderToolbar />

            <div className="viewer-wrapper border border-light rounded shadow-sm bg-dark p-1 mb-4 overflow-hidden">
                <PdfViewer
                    ref={viewerRef}
                    fileUrl={fileUrl}
                    currentPage={currentPage}
                    renderMode={scrollMode ? "scroll" : "page"}
                    totalPages={totalPages}
                    onLoadSuccess={setTotalPages}
                    onVisiblePageChange={(page) => {
                        if (scrollMode) goToPage(page);
                    }}
                />
            </div>
        </div>
    );
}

export default ReaderContainer;