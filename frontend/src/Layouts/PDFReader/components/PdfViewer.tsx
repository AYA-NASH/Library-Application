import { forwardRef } from "react";
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
    ({ fileUrl, currentPage, renderMode, totalPages, onLoadSuccess, onVisiblePageChange }, ref) => {

        const handleScroll = () => {
            const container = ref && "current" in ref ? ref.current : (ref as unknown as HTMLDivElement);
            if (!container || !totalPages) return;

            const pages = Array.from(container.querySelectorAll('[data-page-number]')) as HTMLElement[];
            const containerRect = container.getBoundingClientRect();

            // Find the first page that is visible at the top of the container
            for (const page of pages) {
                const rect = page.getBoundingClientRect();

                // If the bottom of this page is below the top of the container,
                // then this is the current page being viewed.
                if (rect.bottom > containerRect.top + 50) {
                    const pageNum = Number(page.getAttribute('data-page-number'));
                    if (pageNum) {
                        onVisiblePageChange?.(pageNum);
                        break;
                    }
                }
            }
        };

        return (
            <div
                ref={ref}
                className="pdf-viewer-container d-flex flex-column align-items-center"
                style={{
                    maxHeight: "80vh",
                    overflowY: renderMode === "scroll" ? "auto" : "visible",
                    backgroundColor: "#1a1a1a"
                }}
                onScroll={renderMode === "scroll" ? handleScroll : undefined}
            >
                <Document
                    file={fileUrl}
                    onLoadSuccess={({ numPages }) => onLoadSuccess(numPages)}
                    className="d-flex flex-column align-items-center"
                >
                    {renderMode === "scroll" && totalPages
                        ? Array.from({ length: totalPages }, (_, i) => (
                            <Page
                                key={i}
                                pageNumber={i + 1}
                                data-page-number={i + 1}
                                className="mb-3 shadow"
                                loading={<div className="text-white p-5">Loading page...</div>}
                            />
                        ))
                        : (
                            <Page
                                pageNumber={currentPage}
                                className="shadow"
                                loading={<div className="text-white p-5">Loading page...</div>}
                            />
                        )}
                </Document>
            </div>
        );
    }
);

export default PdfViewer;


/*
Document: loads the PDF

Page: renders a single page (important for control)

* */