import { Link } from "react-router-dom";

export const NoFeesEmptyState = () => (
    <div className="text-center py-5">
        <div className="display-1 mb-4">🎉</div>
        <h2 className="fw-bold">No fees yet!</h2>
        <p className="text-muted mb-4">Your account is in good standing. Keep returning those books on time!</p>
        <Link className="btn btn-dark rounded-pill px-5" to="/search">Explore Library</Link>
    </div>
);