import { useEffect, useState } from "react";
import { ReaderAccessResponse } from "../../types/reader.types";

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

type ReaderAccessState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: ReaderAccessResponse }
    | { status: "error"; message: string };

interface FetchReaderAccessOptions {
    bookId: string | number;
    token: string | null;
    mode: "full" | "preview";
}

const readerConfig = {
    apiBaseUrl: baseUrl,
    getFullAccessUrl: (bookId: string | number) => `${baseUrl}/reading/secure/${bookId}/full`,
    getPreviewAccessUrl: (bookId: string | number) => `${baseUrl}/reading/secure/${bookId}/preview`,
} as const;

async function fetchReaderAccess(
    options: FetchReaderAccessOptions
): Promise<ReaderAccessResponse> {
    const { bookId, token, mode } = options;
    const url =
        mode === "preview"
            ? readerConfig.getPreviewAccessUrl(bookId)
            : readerConfig.getFullAccessUrl(bookId);

    const res = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error(`Reader access failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

export function useReaderAccess(bookId: string | undefined, token: string | null, mode: "full" | "preview") {
    const [state, setState] = useState<ReaderAccessState>({ status: "idle" });
    useEffect(() => {
        if (!bookId) {
            setState({ status: "idle" });
            return;
        }

        setState({ status: "loading" });
        fetchReaderAccess({ bookId, token, mode })
            .then((data) => setState({ status: "success", data }))
            .catch((err) =>
                setState({ status: "error", message: err?.message ?? "Failed to load reader access" })
            );
    }, [bookId, token, mode]);
    return state;

}