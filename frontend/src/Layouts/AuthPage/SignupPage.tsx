import { useState } from "react";
import GoogleAuthButton from "../Utils/GoogleAuthButton";

import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthActions } from "../../api/hooks/useAuthActions";

import { parseApiError } from "../../errors/parseApiError";


interface SignupFormInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const formSchema: yup.ObjectSchema<SignupFormInputs> = yup.object({
  username: yup
    .string()
    .required("Add your name.")
    .min(3, "Username must be at least 3 characters long."),
  email: yup
    .string()
    .required("Add your email address.")
    .email("Invalid email format."),
  password: yup
    .string()
    .required("Enter your password.")
    .min(4, "Password must be at least 4 characters long.")
    .max(20, "Password must not exceed 20 characters.")
    .matches(/^\S*$/, "Password cannot contain spaces."),
  confirmPassword: yup
    .string()
    .required("Confirm your password.")
    .oneOf([yup.ref("password")], "Passwords don't match."),
});

const SignupPage = () => {
  const { register: userRegister, isRegistering } = useAuthActions();
  const [serverError, setServerError] = useState("");

  const submitRegister: SubmitHandler<SignupFormInputs> = async (data) => {
    setServerError("");
    try {
      await userRegister(data);
    } catch (err: any) {
      const apiError = parseApiError(err);
      setServerError(apiError.message);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: yupResolver(formSchema),
  });

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light">
      <div
        className="card p-4 shadow rounded-4"
        style={{ width: "100%", maxWidth: "480px" }}
      >
        <div className="card-body">
          <h3 className="text-center mb-3 text-success fw-bold">
            Create Your Account
          </h3>

          <form onSubmit={handleSubmit(submitRegister)}>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control form-control-lg rounded-3 ${errors.email ? "is-invalid" : ""
                  }`}
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <div className="invalid-feedback d-block text-center">
                  {errors.email.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className={`form-control form-control-lg rounded-3 ${errors.username ? "is-invalid" : ""
                  }`}
                placeholder="Choose a username"
                {...register("username")}
              />
              {errors.username && (
                <div className="invalid-feedback d-block text-center">
                  {errors.username.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control form-control-lg rounded-3 ${errors.password ? "is-invalid" : ""
                  }`}
                placeholder="Create a password"
                {...register("password")}
              />
              {errors.password && (
                <div className="invalid-feedback d-block text-center">
                  {errors.password.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-control form-control-lg rounded-3 ${errors.confirmPassword ? "is-invalid" : ""
                  }`}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback d-block text-center">
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>

            {serverError && (
              <div className="alert alert-danger py-2 text-center">
                {serverError}
              </div>
            )}

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-success btn-lg rounded-3"
                disabled={isRegistering}
              >
                {isRegistering ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>

          <GoogleAuthButton />

          <p className="text-center text-muted mt-4" style={{ fontSize: "0.9rem" }}>
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
