export const SpinnerLoading = ({ message = "Loading..." }: { message?: string }) => {
    return (
        <div
            className="container d-flex flex-column justify-content-center align-items-center"
            style={{ minHeight: "60vh" }}
        >
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
            {message && <p className="mt-3 text-muted fw-medium">{message}</p>}
        </div>
    );
};