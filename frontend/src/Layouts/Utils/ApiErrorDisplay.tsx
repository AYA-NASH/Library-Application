import { ApiError } from "../../errors/ApiError";
import { parseApiError } from "../../errors/parseApiError";

interface Props {
    error: unknown;
    title?: string;
    showStatusCode?: boolean;
    onRetry?: () => void;
};

const ErrorRow = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null;
    return (
        <div className="small mb-1">
            <span className="text-muted">{label}: </span>
            <span>{value}</span>
        </div>
    );
};


export const ApiErrorDisplay = ({
    error,
    title = "Something went wrong",
    showStatusCode = true,
    onRetry,
}: Props) => {

    const api: ApiError = parseApiError(error);

    if (api.status === 401) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-warning mb-0">
                    Redirecting to login...
                </div>
            </div>
        );
    }

    if (api.status === 403) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-danger mb-0">
                    Forbidden. You don’t have permission to perform this action.
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="card border-danger shadow-sm mx-auto" style={{ maxWidth: 560 }}>
                <div className="card-body p-4">
                    <div className="text-danger mb-2 fw-bold">{title}</div>
                    <div className="mb-3">
                        <div className="text-muted small mb-2">
                            {showStatusCode && api.status ? `Status: ${api.status}` : " "}
                        </div>
                        <div className="fw-semibold">{api.message}</div>
                        {api.validationErrors && Object.keys(api.validationErrors).length > 0 && (
                            <div className="mt-3">
                                <div className="text-muted small mb-2">Validation details:</div>
                                <ul className="mb-0">
                                    {Object.entries(api.validationErrors).map(([field, msg]) => (
                                        <li key={field}>
                                            <span className="fw-semibold">{field}:</span> {msg}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <ErrorRow label="Path" value={api.path} />
                    </div>
                    {onRetry && (
                        <button className="btn btn-danger w-100" onClick={onRetry}>
                            Try again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
