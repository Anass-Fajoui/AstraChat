import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Login } from "../api/api";

type LoginFormValue = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValue>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data: LoginFormValue) => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const response = await Login(data);
            localStorage.setItem("token", response.token);
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: response.id,
                    name: response.name,
                    username: response.username,
                    email: response.email,
                }),
            );
            navigate("/chat");
        } catch (error: unknown) {
            const err = error as {
                response?: { data?: { message?: string } };
                request?: unknown;
            };
            if (err.response) {
                setErrorMessage(
                    err.response.data?.message || "Invalid credentials",
                );
            } else if (err.request) {
                setErrorMessage(
                    "Unable to connect to server. Please try again.",
                );
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
            style={{ backgroundColor: "var(--bg)" }}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 blur-3xl animate-pulse" />
                <div
                    className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-500/20 to-cyan-500/20 blur-3xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-emerald-400 shadow-2xl shadow-cyan-500/30 mb-6">
                        <svg
                            className="w-10 h-10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{ color: "#0b1021" }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent mb-2">
                        Astra Chat
                    </h1>
                    <p style={{ color: "var(--text-secondary)" }}>
                        Connect, communicate, collaborate
                    </p>
                </div>

                {/* Login Card */}
                <div
                    className="glass-panel rounded-3xl p-8 border shadow-2xl backdrop-blur-xl"
                    style={{
                        borderColor: "var(--stroke)",
                        color: "var(--text-primary)",
                    }}
                >
                    <div className="mb-6">
                        <h2
                            className="text-2xl font-semibold mb-1"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Welcome back
                        </h2>
                        <p
                            style={{ color: "var(--text-secondary)" }}
                            className="text-sm"
                        >
                            Sign in to continue to your conversations
                        </p>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div
                            className="mb-6 rounded-xl border px-4 py-3 flex items-center gap-3"
                            style={{
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                                borderColor: "rgba(239, 68, 68, 0.2)",
                            }}
                        >
                            <svg
                                className="w-5 h-5 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                style={{ color: "var(--error)" }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p
                                className="text-sm"
                                style={{ color: "var(--error)" }}
                            >
                                {errorMessage}
                            </p>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        style={{
                                            color: "var(--text-secondary)",
                                        }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    style={{
                                        backgroundColor: "var(--input-bg)",
                                        borderColor: "var(--stroke)",
                                        color: "var(--input-text)",
                                    }}
                                    className="w-full rounded-xl border pl-12 pr-4 py-3.5 placeholder:text-slate-500 focus:outline-none transition-all"
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor =
                                            "var(--accent)";
                                        e.currentTarget.style.boxShadow =
                                            "0 0 0 3px rgba(14, 165, 233, 0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor =
                                            "var(--stroke)";
                                        e.currentTarget.style.boxShadow =
                                            "none";
                                    }}
                                />
                            </div>
                            {errors.email && (
                                <p
                                    className="text-sm flex items-center gap-1"
                                    style={{ color: "var(--warning)" }}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01"
                                        />
                                    </svg>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        style={{
                                            color: "var(--text-secondary)",
                                        }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message:
                                                "Password must be at least 6 characters",
                                        },
                                    })}
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    style={{
                                        backgroundColor: "var(--input-bg)",
                                        borderColor: "var(--stroke)",
                                        color: "var(--input-text)",
                                    }}
                                    className="w-full rounded-xl border pl-12 pr-4 py-3.5 placeholder:text-slate-500 focus:outline-none transition-all"
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor =
                                            "var(--accent)";
                                        e.currentTarget.style.boxShadow =
                                            "0 0 0 3px rgba(14, 165, 233, 0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor =
                                            "var(--stroke)";
                                        e.currentTarget.style.boxShadow =
                                            "none";
                                    }}
                                />
                            </div>
                            {errors.password && (
                                <p
                                    className="text-sm flex items-center gap-1"
                                    style={{ color: "var(--warning)" }}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01"
                                        />
                                    </svg>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                            style={{
                                backgroundColor: "var(--accent)",
                                boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow =
                                    "0 6px 16px rgba(14, 165, 233, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow =
                                    "0 4px 12px rgba(14, 165, 233, 0.3)";
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <div
                                        className="w-5 h-5 border-2 border-t-white rounded-full animate-spin"
                                        style={{
                                            borderColor:
                                                "rgba(255, 255, 255, 0.3)",
                                            borderTopColor: "white",
                                        }}
                                    />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div
                            className="flex-1 h-px"
                            style={{
                                background:
                                    "linear-gradient(to right, transparent, var(--stroke), transparent)",
                            }}
                        />
                        <span
                            className="text-xs uppercase tracking-wider"
                            style={{ color: "var(--text-muted)" }}
                        >
                            or
                        </span>
                        <div
                            className="flex-1 h-px"
                            style={{
                                background:
                                    "linear-gradient(to right, transparent, var(--stroke), transparent)",
                            }}
                        />
                    </div>

                    {/* Sign Up Link */}
                    <p style={{ color: "var(--text-secondary)" }}>
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-semibold transition-colors"
                            style={{ color: "var(--accent)" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color =
                                    "var(--accent-light)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "var(--accent)";
                            }}
                        >
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <p
                    className="text-center text-sm mt-8"
                    style={{ color: "var(--text-secondary)" }}
                >
                    © 2026 Astra Chat. Secure messaging for everyone.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
