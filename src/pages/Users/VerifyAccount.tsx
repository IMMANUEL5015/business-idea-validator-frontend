import { useState, useEffect, useRef } from "react";
import { Container, Alert } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser, verifyUser } from "../../api/users";
import type { ApiErrorResponse } from "../../types/common";
import axios from "axios";

const COUNTDOWN_SECONDS = 5 * 60;

const verifySchema = z.object({
    code: z
        .string()
        .length(6, "Code must be exactly 6 digits")
        .regex(/^\d{6}$/, "Code must contain only digits"),
});

type VerifyFormData = z.infer<typeof verifySchema>;

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
};

const VerifyAccount = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") ?? "";

    const [alert, setAlert] = useState<{ type: "success" | "danger" | "info"; message: string } | null>(null);
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
    const [isResending, setIsResending] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startCountdown = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setCountdown(COUNTDOWN_SECONDS);
        intervalRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        startCountdown();
        return () => clearInterval(intervalRef.current!);
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<VerifyFormData>({
        resolver: zodResolver(verifySchema),
    });

    const code = watch("code");

    const handleError = (err: unknown, fallback: string) => {
        if (axios.isAxiosError(err) && err.response) {
            const errorData = err.response.data as ApiErrorResponse;
            const detail = errorData.detail;
            const message = typeof detail === "string"
                ? detail
                : detail?.[0]?.msg ?? fallback;
            setAlert({ type: "danger", message });
        } else {
            setAlert({ type: "danger", message: "An unexpected error occurred. Please try again." });
        }
    };

    const onSubmit = async (data: VerifyFormData) => {
        setAlert(null);
        try {
            const response = await verifyUser({ email, code: data.code });
            localStorage.setItem("access_token", response.access_token);
            setAlert({ type: "success", message: "Account verified! Redirecting..." });
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            handleError(err, "Verification failed. Please try again.");
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        setAlert(null);
        try {
            await loginUser({ email });
            setAlert({ type: "info", message: "A new OTP has been sent to your email." });
            startCountdown();
        } catch (err) {
            handleError(err, "Failed to resend OTP. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <Container className="my-5">
            <div className="row">
                <h1 className="text-primary text-center">Provide Your OTP</h1>
                {email && (
                    <p className="text-center text-body-secondary mb-0">
                        A 6-digit code was sent to <strong>{email}</strong>
                    </p>
                )}

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
                        <label htmlFor="code" className="form-label">One Time Password</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            className={`form-control ${errors.code ? "is-invalid" : code?.length === 6 ? "is-valid" : ""}`}
                            id="code"
                            placeholder="______"
                            {...register("code")}
                        />
                        {errors.code && (
                            <div className="invalid-feedback">{errors.code.message}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Verifying..." : "Verify"}
                    </button>

                    <p className="mt-3 text-center text-body-secondary">
                        {countdown > 0 ? (
                            <>Did not get an OTP? Resend in <strong className="text-primary">{formatTime(countdown)}</strong></>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-link p-0"
                                onClick={handleResend}
                                disabled={isResending}
                            >
                                {isResending ? "Sending..." : "Resend OTP"}
                            </button>
                        )}
                    </p>
                </form>
            </div>
        </Container>
    );
};

export default VerifyAccount;