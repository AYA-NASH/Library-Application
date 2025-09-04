import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = ()=>{
        logout("You've been Logged out Successfully");
        navigate("/");
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        Library
                    </a>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle Navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Home
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/search">
                                    Search Books
                                </Link>
                            </li>
                        
                            {user &&
                                <li className="nav-item">
                                    <Link className="nav-link" to="/shelf">
                                        Shelf
                                    </Link>
                                </li>}
                        </ul>

                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item m-1">
                            {!user ? (
                                <Link
                                    to="/login"
                                    className="btn btn-outline-light"
                                >
                                    Sign in
                                </Link>
                            ):(
                                <button
                                    className="btn btn-outline-warning"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
