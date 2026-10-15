import { useEffect, useRef } from "react";

import { useReader } from "./ReaderContext";
import { useReaderKeyboard } from "./useReaderKeyboard";
import { ReaderToolbar } from "./ReaderToolbar";
import PdfViewer from "./PdfViewer";
import { useBlobCleanup } from "./useBlobCleanup";

interface ReaderContainerProps {
    fileUrl: string;
}

const ReaderContainer = ({ fileUrl }: ReaderContainerProps) => {
    const {
        currentPage,
        totalPages,
        setTotalPages,
        scrollMode,
        goToPage,
    } = useReader();

    const viewerRef = useRef<HTMLDivElement>(null);

    useBlobCleanup(fileUrl);
    useReaderKeyboard();

    useEffect(() => {
        if (!scrollMode || !viewerRef.current) return;

        const pageElement = viewerRef.current.querySelector(
            `[data-page-number="${currentPage}"]`,
        );

        pageElement?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }, [currentPage, scrollMode]);

    return (
        <div className="flex min-w-0 flex-col gap-4">
            <ReaderToolbar />

            <div className="overflow-hidden rounded-lg border border-border bg-muted/30 p-1 shadow-sm">
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
};

export default ReaderContainer;