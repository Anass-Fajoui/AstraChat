import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Register } from "../api/api";

type RegisterFormValue = {
    name: string;
    username: string;
    email: string;
    password: string;
};

const SignUpPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValue>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data: RegisterFormValue) => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const response = await Register(data);
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
                    err.response.data?.message || "Registration failed",
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
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 blur-3xl animate-pulse" />
                <div
                    className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 blur-3xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-2xl shadow-emerald-500/30 mb-6">
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
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent mb-2">
                        Join Astra Chat
                    </h1>
                    <p style={{ color: "var(--text-secondary)" }}>
                        Create your account and start connecting
                    </p>
                </div>

                {/* Sign Up Card */}
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
                            Create account
                        </h2>
                        <p
                            style={{ color: "var(--text-secondary)" }}
                            className="text-sm"
                        >
                            Fill in your details to get started
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
                        className="space-y-4"
                    >
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Full Name
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
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    {...register("name", {
                                        required: "Name is required",
                                        minLength: {
                                            value: 2,
                                            message:
                                                "Name must be at least 2 characters",
                                        },
                                    })}
                                    id="name"
                                    type="text"
                                    placeholder="Jane Doe"
                                    style={{
                                        backgroundColor: "var(--input-bg)",
                                        borderColor: "var(--stroke)",
                                        color: "var(--input-text)",
                                    }}
                                    className="w-full rounded-xl border pl-12 pr-4 py-3 placeholder:text-slate-500 focus:outline-none transition-all"
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
                            {errors.name && (
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
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Username
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
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </div>
                                <input
                                    {...register("username", {
                                        required: "Username is required",
                                        minLength: {
                                            value: 3,
                                            message:
                                                "Username must be at least 3 characters",
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9_]+$/,
                                            message:
                                                "Only letters, numbers and underscores",
                                        },
                                    })}
                                    id="username"
                                    type="text"
                                    placeholder="astrofan"
                                    style={{
                                        backgroundColor: "var(--input-bg)",
                                        borderColor: "var(--stroke)",
                                        color: "var(--input-text)",
                                    }}
                                    className="w-full rounded-xl border pl-12 pr-4 py-3 placeholder:text-slate-500 focus:outline-none transition-all"
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
                            {errors.username && (
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
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

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
                                    className="w-full rounded-xl border pl-12 pr-4 py-3 placeholder:text-slate-500 focus:outline-none transition-all"
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
                                    className="w-full rounded-xl border pl-12 pr-4 py-3 placeholder:text-slate-500 focus:outline-none transition-all"
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
                            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
                            style={{
                                backgroundColor: "var(--accent)",
                                boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow =
                                    "0 6px 16px rgba(16, 185, 129, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow =
                                    "0 4px 12px rgba(16, 185, 129, 0.3)";
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
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create account
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

                    {/* Login Link */}
                    <p style={{ color: "var(--text-secondary)" }}>
                        Already have an account?{" "}
                        <Link
                            to="/login"
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
                            Sign in
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

export default SignUpPage;
