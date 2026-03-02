import { useEffect, useState } from "react";

export function useReadingProgress(bookId: string) {
    // Every book gets its own storage entry
    const storageKey = `reading-progress-${bookId}`;

    // Reading from storage (once)
    const [lastPage, setLastPage] = useState<number>(() => {
        const storedLastPage = localStorage.getItem(storageKey);
        return storedLastPage ? Number(storedLastPage) : 1;
    });

    // Writing to storage (on change)
    // Runs only when lastPage changes
    useEffect(() => {
        localStorage.setItem(storageKey, String(lastPage));
    }, [lastPage, storageKey]);


    // The hook provides state, not behavior.
    // lastPage = value restored from storage
    // setLastPage = persistence-aware setter
    return { lastPage, setLastPage };
}


/**
 * (frontend-only persistence)
        Storage.setItem(storageKey, page);
        localStorage.getItem(storageKey);

 * Later (backend-backed persistence)
        GET  /api/reading-progress/{bookId}
        POST /api/reading-progress/{bookId}


 * What changes:
    Where data is stored
    How it is fetched
    How it is saved
 *
 */

// Therefore:

// Hook = persistence mechanism
//
// Container = domain authority
