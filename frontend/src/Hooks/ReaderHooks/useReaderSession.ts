import { useEffect } from "react";

const SESSION_STORAGE_KEY = "active-reader-sessions";

/** Update active session for cross-tab "Reading Now" status. */
export function useReaderSession(bookId: string | undefined, active: boolean) {
  useEffect(() => {
    if (!bookId) return;

    const updateSession = (isActive: boolean) => {
      const sessions: Record<string, number> = JSON.parse(
        localStorage.getItem(SESSION_STORAGE_KEY) ?? "{}"
      );
      if (isActive) {
        sessions[bookId] = Date.now();
      } else {
        delete sessions[bookId];
      }
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
      window.dispatchEvent(new StorageEvent("storage"));
    };

    updateSession(active);
    return () => updateSession(false);
  }, [bookId, active]);
}

/** Check if a book is currently open in another tab. */
export function getIsBookOpen(bookId: string): boolean {
  const sessions: Record<string, number> = JSON.parse(
    localStorage.getItem(SESSION_STORAGE_KEY) ?? "{}"
  );
  return !!sessions[bookId];
}
