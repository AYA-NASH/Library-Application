import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import { useReadingProgress } from "../../../api/hooks/ReaderHooks/useReadingProgress";

interface ReaderContextType {
    currentPage: number;
    totalPages: number;
    setTotalPages: (pages: number) => void;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    maxAllowedPage: number;
    scrollMode: boolean;
    setScrollMode: (active: boolean) => void;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

interface ReaderProviderProps {
    bookId: number;
    initialPage: number;
    maxAllowed: number;
    children: ReactNode;
}

export const ReaderProvider = ({
    bookId,
    initialPage,
    maxAllowed,
    children,
}: ReaderProviderProps) => {
    const [currentPage, setCurrentPage] = useState(
        Math.max(1, initialPage || 1),
    );
    const [totalPages, setTotalPagesState] = useState(0);
    const [scrollMode, setScrollMode] = useState(false);

    const { syncProgress } = useReadingProgress(bookId);

    const getPageLimit = (pages = totalPages) => {
        if (pages <= 0) return 1;
        return maxAllowed > 0 ? Math.min(maxAllowed, pages) : pages;
    };

    const goToPage = (page: number) => {
        const limit = getPageLimit();
        const validatedPage = Math.max(1, Math.min(Math.floor(page), limit));

        setCurrentPage(validatedPage);
        syncProgress(validatedPage);
    };

    const handleSetTotalPages = (pages: number) => {
        const validTotal = Math.max(0, Math.floor(pages));
        setTotalPagesState(validTotal);

        if (validTotal > 0) {
            setCurrentPage((current) =>
                Math.max(1, Math.min(current, getPageLimit(validTotal))),
            );
        }
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    return (
        <ReaderContext.Provider
            value={{
                currentPage,
                totalPages,
                setTotalPages: handleSetTotalPages,
                goToPage,
                nextPage,
                prevPage,
                maxAllowedPage: maxAllowed,
                scrollMode,
                setScrollMode,
            }}
        >
            {children}
        </ReaderContext.Provider>
    );
};

export const useReader = () => {
    const context = useContext(ReaderContext);

    if (!context) {
        throw new Error("useReader must be used within a ReaderProvider");
    }

    return context;
};