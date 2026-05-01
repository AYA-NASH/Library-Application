import { useEffect } from "react";
import { useReader } from "./ReaderContext";

export const useReaderKeyboard = () => {
    const { nextPage, prevPage, scrollMode } = useReader();

    useEffect(() => {
        if (scrollMode) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prevPage();
            if (e.key === "ArrowRight") nextPage();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [nextPage, prevPage, scrollMode]);
};