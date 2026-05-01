export const ErrorDisplay = ({ 
    message = "Something went wrong.", 
    onBack 
}: { 
    message?: string; 
    onBack: () => void;
}) => {
    return (
        <div className="container py-5 text-center">
            <div className="card border-danger shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
                <div className="card-body p-5">
                    <i className="bi bi-exclamation-octagon text-danger display-4 mb-3"></i>
                    <h3 className="h5 fw-bold">Unable to Load Reader</h3>
                    <p className="text-muted mb-4">{message}</p>
                    <button className="btn btn-outline-secondary rounded-pill px-4" onClick={onBack}>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};