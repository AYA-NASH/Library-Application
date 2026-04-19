import { useCallback, useEffect, useState } from "react";

const SESSION_STORAGE_KEY = "active-reader-sessions";

const getSessions = (): Record<string, number> => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function useReaderSession(bookId: string | undefined, active: boolean) {
  const [isBookOpenElsewhere, setIsBookOpenElsewhere] = useState(false);

  const checkOtherSessions = useCallback(() => {
    if (!bookId) return;
    const sessions = getSessions();
    setIsBookOpenElsewhere(!!sessions[bookId.toString()]);
  }, [bookId]);

  useEffect(() => {
    if (!bookId) return;

    const bookKey = bookId.toString();

    const updateGlobalStatus = (isActive: boolean) => {
      const sessions = getSessions();
      if (isActive) {
        sessions[bookKey] = Date.now();
      } else {
        delete sessions[bookKey];
      }
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));

      window.dispatchEvent(new StorageEvent("storage"));
    };

    updateGlobalStatus(active);

    // Listen for changes from OTHER tabs
    window.addEventListener("storage", checkOtherSessions);

    checkOtherSessions();

    return () => {
      updateGlobalStatus(false);
      window.removeEventListener("storage", checkOtherSessions);
    };
  }, [bookId, active, checkOtherSessions]);

  return { isBookOpenElsewhere };
}