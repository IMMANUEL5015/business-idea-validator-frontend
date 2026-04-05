import { useState } from "react";
import { Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "../../api/users";
import type { ApiErrorResponse } from "../../types/common";
import axios from "axios";

const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const email = watch("email");

    const onSubmit = async (data: LoginFormData) => {
        setAlert(null);
        try {
            await loginUser({ email: data.email });
            setAlert({ type: "success", message: "Account Found! OTP Sent To Your Email..." });
            setTimeout(() => navigate(`/verify-email?email=${data.email}`), 2000);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                const errorData = err.response.data as ApiErrorResponse;
                const detail = errorData.detail;
                const message = typeof detail === "string"
                    ? detail
                    : detail?.[0]?.msg ?? "Login attempt failed. Please try again.";
                setAlert({ type: "danger", message });
            } else {
                setAlert({ type: "danger", message: "An unexpected error occurred. Please try again." });
            }
        }
    };

    return (
        <Container className="my-5">
            <div className="row">
                <h1 className="text-primary text-center">Login To Your Account</h1>

                <form
                    className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 mt-3"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {alert && (
                        <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
                            {alert.message}
                        </Alert>
                    )}

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? "is-invalid" : email ? "is-valid" : ""}`}
                            id="email"
                            aria-describedby="emailHelp"
                            {...register("email")}
                        />
                        {errors.email ? (
                            <div className="invalid-feedback">{errors.email.message}</div>
                        ) : (
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Logging you in..." : "Login User"}
                    </button>

                    <p className="mt-3 text-center">
                        Don't have an account? <Link to="/signup">Signup</Link>
                    </p>
                </form>
            </div>
        </Container>
    );
};

export default Login;