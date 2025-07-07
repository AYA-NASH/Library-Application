import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleAuthButton from "../Utils/GoogleAuthButton";

const SignupPage = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const newUser = { email, username, password };
        const registerUrl = "http://localhost:8080/register";
        try {
            const response = await fetch(registerUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                const user = await response.json();
                console.log("Created User: ", user);
                navigate("/login");
            } else {
                const message = await response.text();
                setError(message || "Failed to register.");
            }
        } catch (err) {
            setError("An error occurred while registering.");
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center bg-light"
            style={{ minHeight: "100vh" }}
        >
            <div
                className="card p-4 shadow rounded-4"
                style={{ width: "100%", maxWidth: "480px" }}
            >
                <div className="card-body">
                    <h3 className="text-center mb-3 text-success fw-bold">
                        Create Your Account
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control form-control-lg rounded-3"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">username</label>
                            <input
                                type="text"
                                className="form-control form-control-lg rounded-3"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control form-control-lg rounded-3"
                                placeholder="Create a Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Confirmed Password
                            </label>
                            <input
                                type="password"
                                className="form-control form-control-lg rounded-3"
                                placeholder="Confirm your Password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>

                        {error && (
                            <div className="alert alert-danger py-2 text-center">
                                {error}
                            </div>
                        )}

                        <div className="d-grid">
                            <button
                                type="submit"
                                className="btn btn-success btn-lg rounded-3"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                    <GoogleAuthButton />

                    <p
                        className="text-center text-muted mt-4"
                        style={{ fontSize: "0.9rem" }}
                    >
                        Already have an account?{" "}
                        <a href="/login" className="text-decoration-none">
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
