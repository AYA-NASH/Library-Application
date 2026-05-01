export type ValidationErrors = Record<string, string>;

export interface ApiError {
    status?: number;
    error?: string;
    message: string;
    path?: string;
    validationErrors?: ValidationErrors;

    raw?: unknown;
};