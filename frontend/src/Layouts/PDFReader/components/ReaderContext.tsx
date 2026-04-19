import React, { createContext, useContext, useState } from "react";
import { useReadingProgress } from "../../../api/hooks/ReaderHooks/useReadingProgress";

interface ReaderContextType {
    currentPage: number;
    totalPages: number;
    setTotalPages: (n: number) => void;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    maxAllowedPage: number;
    scrollMode: boolean;
    setScrollMode: (active: boolean) => void;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export const ReaderProvider: React.FC<{
    bookId: number;
    initialPage: number;
    maxAllowed: number;
    children: React.ReactNode
}> = ({ bookId, initialPage, maxAllowed, children }) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(0);
    const [scrollMode, setScrollMode] = useState(false);

    const { syncProgress } = useReadingProgress(bookId);

    // Update current page and sync to DB
    const goToPage = (page: number) => {
        const limit = maxAllowed > 0 ? maxAllowed : totalPages;
        const validatedPage = Math.max(1, Math.min(page, limit));
        setCurrentPage(validatedPage);
        syncProgress(validatedPage);
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    return (
        <ReaderContext.Provider value={{
            currentPage, totalPages, setTotalPages,
            goToPage, nextPage, prevPage,
            maxAllowedPage: maxAllowed,
            scrollMode, setScrollMode
        }}>
            {children}
        </ReaderContext.Provider>
    );
};

export const useReader = () => {
    const context = useContext(ReaderContext);
    if (!context) throw new Error("useReader must be used within a ReaderProvider");
    return context;
};