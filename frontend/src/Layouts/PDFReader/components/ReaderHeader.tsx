interface ReaderHeaderProps {
    title: string;
    onExit: () => void;
    type: "Reader" | "Preview";
}

export const ReaderHeader = ({ title, onExit, type }: ReaderHeaderProps) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4 px-2">
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-1">
                        <li className="breadcrumb-item small">
                            <button className="text-decoration-none text-muted bg-transparent border-0 p-0" onClick={onExit}>
                                Back
                            </button>
                        </li>
                        <li className="breadcrumb-item active small" aria-current="page">
                            {type}
                        </li>
                    </ol>
                </nav>
                <h1 className="h3 mb-0 text-truncate fw-bold text-dark" style={{ maxWidth: "400px" }}>
                    {title}
                </h1>
            </div>
            <button
                className={`btn btn-sm rounded-pill px-4 shadow-sm ${type === "Preview" ? "btn-outline-primary" : "btn-outline-dark"
                    }`}
                onClick={onExit}
            >
                {type === "Preview" ? "Close Preview" : "Exit Reader"}
            </button>
        </div>
    );
};