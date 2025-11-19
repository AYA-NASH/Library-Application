import { useAuth } from "../../Auth/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import GoogleAuthButton from "../Utils/GoogleAuthButton";

import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";


interface LoginFormInputs {
  email: string;
  password: string;
}

const formSchema: yup.Schema<LoginFormInputs> = yup.object({
  email: yup.string().required("Enter your email").email("Invalid email format"),
  password: yup.string().required("Enter your password"),
});

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        } = useForm<LoginFormInputs>({
        resolver: yupResolver(formSchema),
    });

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
     
        setError("");
        setSubmitting(true);

        try {
            await login(data.email, data.password);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err?.message || "Invalid credentials");
        } finally {
            setSubmitting(false);
        }

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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        
                        <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="text"
                            id="email"
                            className={`form-control form-control-lg rounded-3 ${errors.email ? "is-invalid" : ""}`}
                            placeholder="Enter your email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <div className="invalid-feedback d-block text-center">{errors.email.message}</div>
                        )}
                        </div>
                
                        <div className="mb-4">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className={`form-control form-control-lg rounded-3 ${errors.password ? "is-invalid" : ""}`}
                            placeholder="Enter your password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <div className="invalid-feedback d-block text-center">{errors.password.message}</div>
                        )}
                        </div>

                        {error && (
                        <div className="alert alert-danger py-2 text-center">{error}</div>
                        )}

                        <div className="d-grid mb-3">
                            <button type="submit" className="btn btn-primary btn-lg rounded-3" disabled={submitting}>
                                {submitting ? "Signing in..." : "Sign In"}
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
