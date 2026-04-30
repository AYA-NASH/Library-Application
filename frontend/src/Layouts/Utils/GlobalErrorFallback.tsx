import React from "react";
import { FallbackProps } from "react-error-boundary";

export const GlobalErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
    return (
        <div className="container py-5 mt-5">
            <div className="card border-danger shadow-lg mx-auto" style={{ maxWidth: "600px" }}>
                <div className="card-body text-center p-5">
                    <div className="mb-4">
                        <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: "4rem" }}></i>
                    </div>
                    <h2 className="fw-bold mb-3">Oops! Something went wrong.</h2>
                    <p className="text-muted mb-4">
                        The application encountered an unexpected error. Don't worry, your data is safe, but we need to restart the current view.
                    </p>
                    
                    <div className="bg-light p-3 rounded-3 mb-4 text-start">
                        <p className="small text-danger fw-mono mb-0 overflow-auto" style={{ maxHeight: "100px" }}>
                            {error?.message || "Unknown error"}
                        </p>
                    </div>

                    <div className="d-grid gap-2">
                        <button 
                            className="btn btn-danger btn-lg fw-bold" 
                            onClick={resetErrorBoundary}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Try to Recover
                        </button>
                        <a 
                            className="btn btn-outline-secondary" 
                            href="/"
                        >
                            Go to Homepage
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
