import type { AxiosError } from "axios";
import { ApiError } from "./ApiError";

interface BackendErrorShape {
    status?: number;
    error?: string;
    message?: string;
    path?: string;
    validationErrors?: Record<string, string>;
};

export function parseApiError(err: unknown): ApiError {
    const axiosError = err as AxiosError<any>;

    const status = axiosError?.response?.status;
    const data = axiosError?.response?.data;

    const backend = data as BackendErrorShape | undefined;
    const messageFromBackend = backend?.message;
    const errorTypeFromBackend = backend?.error;
    const path = backend?.path;
    const validationErrors = backend?.validationErrors;


    // If backend returned plain text or unknown object
    const messageFromUnknown =
        typeof data === "string"
            ? data
            : data?.message
                ? String(data.message)
                : undefined;

    // Network error (no response): timeout/offline/CORS issues
    if (!axiosError?.response) {
        return {
            status: undefined,
            error: "Network Error",
            message: "Network error. Please check your connection and try again.",
            path: undefined,
            validationErrors: undefined,
            raw: err,
        };
    }


    const message = messageFromBackend || messageFromUnknown || "Something went wrong.";

    return {
        status,
        error: errorTypeFromBackend,
        message,
        path,
        validationErrors,
        raw: err,
    };
}