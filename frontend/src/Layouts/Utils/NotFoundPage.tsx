import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
    return (
        <div className="container py-5 mt-5 text-center">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="mb-4">
                        <h1 className="display-1 fw-bold text-muted opacity-25" style={{ fontSize: "10rem" }}>404</h1>
                    </div>
                    <div className="card border-0 shadow-sm rounded-4 p-5 mt-n5" style={{ marginTop: "-4rem", position: "relative" }}>
                        <h2 className="fw-bold mb-3">Page Not Found</h2>
                        <p className="text-muted lead mb-4">
                            The book you're looking for might have been archived, or the page address has changed.
                        </p>
                        
                        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-2">
                            <Link to="/" className="btn btn-dark btn-lg px-4 gap-3 rounded-pill fw-bold">
                                Back to Homepage
                            </Link>
                            <Link to="/search" className="btn btn-outline-secondary btn-lg px-4 rounded-pill">
                                Search Catalog
                            </Link>
                        </div>
                    </div>
                    
                    <div className="mt-5 pt-4">
                        <p className="text-muted small">
                            Think this is a mistake? <Link to="/messages" className="text-decoration-none">Contact our Librarians</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
