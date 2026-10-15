import { useCallback, useEffect, useRef, useState } from "react";

const SESSION_STORAGE_KEY = "active-reader-sessions";
const SESSION_EVENT = "active-reader-sessions-changed";
const STALE_AFTER_MS = 60_000;
const HEARTBEAT_INTERVAL_MS = 15_000;

type ReaderSessions = Record<string, Record<string, number>>;

const getSessions = (): ReaderSessions => {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(SESSION_STORAGE_KEY) ?? "{}"
    );

    if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
      return {};
    }

    const now = Date.now();
    const result: ReaderSessions = {};

    for (const [bookId, sessions] of Object.entries(stored)) {
      if (
        !sessions ||
        typeof sessions !== "object" ||
        Array.isArray(sessions)
      ) {
        continue;
      }

      const activeSessions: Record<string, number> = {};

      for (const [sessionId, timestamp] of Object.entries(sessions)) {
        if (
          typeof timestamp === "number" &&
          timestamp <= now &&
          now - timestamp < STALE_AFTER_MS
        ) {
          activeSessions[sessionId] = timestamp;
        }
      }

      if (Object.keys(activeSessions).length > 0) {
        result[bookId] = activeSessions;
      }
    }
    return result;
  } catch {
    return {};
  }
}

const notifySessionChange = () => {
  window.dispatchEvent(new Event(SESSION_EVENT));
};

export function useReaderSession(bookId: string | undefined, active: boolean) {
  const [isBookOpenElsewhere, setIsBookOpenElsewhere] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  if (sessionIdRef.current === null) {
    sessionIdRef.current = crypto.randomUUID();
  }

  const sessionId = sessionIdRef.current;

  const checkOtherSessions = useCallback(() => {
    if (!bookId) {
      setIsBookOpenElsewhere(false);
      return;
    }

    const sessions = getSessions();
    const bookSessions = sessions[bookId] ?? {};

    setIsBookOpenElsewhere(
      Object.keys(bookSessions).some((id) => id !== sessionId)
    );
  }, [bookId, sessionId]);


  useEffect(() => {
    if (!bookId) return;

    // Register or remove only this reader's session.
    const updateOwnSession = (timestamp: number | null) => {
      const sessions = getSessions();
      const bookSessions = sessions[bookId] ?? {};

      if (timestamp === null) {
        delete bookSessions[sessionId];
      } else {
        bookSessions[sessionId] = timestamp;
      }

      if (Object.keys(bookSessions).length > 0) {
        sessions[bookId] = bookSessions;
      } else {
        delete sessions[bookId];
      }

      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(sessions)
      );

      notifySessionChange();
    };

    // Only an active reader registers itself.
    if (active) {
      updateOwnSession(Date.now());
    }

    const heartbeat = active
      ? window.setInterval(
        () => updateOwnSession(Date.now()),
        HEARTBEAT_INTERVAL_MS
      )
      : undefined;

    window.addEventListener("storage", checkOtherSessions);
    window.addEventListener(SESSION_EVENT, checkOtherSessions);

    const checkInterval = window.setInterval(
      checkOtherSessions,
      HEARTBEAT_INTERVAL_MS
    );

    checkOtherSessions();

    return () => {
      if (heartbeat !== undefined) {
        window.clearInterval(heartbeat);
      }

      window.clearInterval(checkInterval);
      window.removeEventListener("storage", checkOtherSessions);
      window.removeEventListener(SESSION_EVENT, checkOtherSessions);

      // An inactive page must not remove any session.
      if (active) {
        updateOwnSession(null);
      }
    };
  }, [bookId, active, sessionId, checkOtherSessions]);

  return { isBookOpenElsewhere };
}