import { forwardRef, useCallback, useRef } from "react";
import { Document, Page } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

interface PdfViewerProps {
    fileUrl: string;
    currentPage: number;
    renderMode: "page" | "scroll";
    totalPages?: number;
    onLoadSuccess: (pages: number) => void;
    onVisiblePageChange?: (page: number) => void;
}

const PdfViewer = forwardRef<HTMLDivElement, PdfViewerProps>(
    (
        {
            fileUrl,
            currentPage,
            renderMode,
            totalPages = 0,
            onLoadSuccess,
            onVisiblePageChange,
        },
        forwardedRef,
    ) => {
        const internalRef = useRef<HTMLDivElement>(null);
        const lastReportedPage = useRef<number | null>(null);

        const setContainerRef = (node: HTMLDivElement | null) => {
            internalRef.current = node;

            if (typeof forwardedRef === "function") {
                forwardedRef(node);
            } else if (forwardedRef) {
                forwardedRef.current = node;
            }
        };

        const handleScroll = useCallback(() => {
            const container = internalRef.current;

            if (!container || !totalPages || !onVisiblePageChange) return;

            const pages = container.querySelectorAll<HTMLElement>(
                "[data-page-number]",
            );
            const containerTop = container.getBoundingClientRect().top + 50;

            for (const page of pages) {
                const rect = page.getBoundingClientRect();

                if (rect.bottom > containerTop) {
                    const pageNumber = Number(page.dataset.pageNumber);

                    if (
                        pageNumber > 0 &&
                        pageNumber !== lastReportedPage.current
                    ) {
                        lastReportedPage.current = pageNumber;
                        onVisiblePageChange(pageNumber);
                    }

                    break;
                }
            }
        }, [totalPages, onVisiblePageChange]);

        return (
            <div
                ref={setContainerRef}
                className={[
                    "flex flex-col items-center bg-neutral-900",
                    "max-h-[80vh] w-full",
                    renderMode === "scroll"
                        ? "overflow-y-auto overscroll-contain"
                        : "overflow-visible",
                ].join(" ")}
                onScroll={renderMode === "scroll" ? handleScroll : undefined}
            >
                <Document
                    file={fileUrl}
                    onLoadSuccess={({ numPages }) => {
                        lastReportedPage.current = null;
                        onLoadSuccess(numPages);
                    }}
                    loading={
                        <p className="p-8 text-sm text-muted-foreground">
                            Loading PDF...
                        </p>
                    }
                    error={
                        <p className="p-8 text-sm text-destructive">
                            Unable to load the PDF. Please try again.
                        </p>
                    }
                    className="flex flex-col items-center"
                >
                    {renderMode === "scroll" && totalPages > 0 ? (
                        Array.from({ length: totalPages }, (_, index) => (
                            <Page
                                key={index + 1}
                                pageNumber={index + 1}
                                data-page-number={index + 1}
                                className="mb-4 max-w-full shadow-md"
                                loading={
                                    <div className="p-8 text-sm text-muted-foreground">
                                        Loading page {index + 1}...
                                    </div>
                                }
                            />
                        ))
                    ) : (
                        <Page
                            pageNumber={currentPage}
                            className="max-w-full shadow-md"
                            loading={
                                <div className="p-8 text-sm text-muted-foreground">
                                    Loading page...
                                </div>
                            }
                        />
                    )}
                </Document>
            </div>
        );
    },
);

PdfViewer.displayName = "PdfViewer";

export default PdfViewer;