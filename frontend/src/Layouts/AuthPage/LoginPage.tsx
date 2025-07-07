import { useAuth } from "../../Auth/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import GoogleAuthButton from "../Utils/GoogleAuthButton";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);

        navigate(from, { replace: true });
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center bg-light"
            style={{ minHeight: "100vh" }}
        >
            <div
                className="card p-4 shadow rounded-4"
                style={{ width: "100%", maxWidth: "420px" }}
            >
                <div className="card-body">
                    <h3 className="text-center mb-4 text-primary fw-bold">
                        Welcome Back
                    </h3>
                    <p className="text-center text-muted mb-4">
                        Please sign in to continue
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email address
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-lg rounded-3"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control form-control-lg rounded-3"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-grid mb-3">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg rounded-3"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                    <GoogleAuthButton />
                    <p
                        className="text-center text-muted mt-3 mb-0"
                        style={{ fontSize: "0.9rem" }}
                    >
                        Need an account?{" "}
                        <Link to="/signup" className="text-decoration-none">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
