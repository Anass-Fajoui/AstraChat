import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Login } from "../api/api";

type LoginFormValue = {
    email: string;
    password: string;
};
type AuthResponse = {
    id: string;
    name: string;
    username: string;
    email: string;
    token: string;
};

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValue>();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormValue) => {
        try {
            let response = await Login(data);
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
        } catch (error: any) {
            if (error.response) {
                console.log("Server  error: ", error.response.data);
                alert(error.response.data.message || "Registration Error");
            } else if (error.request) {
                console.log("Network error:", error.request);
                alert("No response from server. Please try again later.");
            } else {
                console.log("Unexpected error:", error.message);
                alert("Unexpected error occurred.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="glass-panel w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1.1fr_1fr] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-cyan-500/30 via-sky-500/30 to-emerald-400/20">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.35),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(251,191,36,0.35),transparent_30%)]" />
                    <div className="relative space-y-4">
                        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-cyan-100 border border-white/15">
                            Live securely, chat beautifully
                        </p>
                        <h2 className="text-3xl font-semibold text-slate-50 leading-tight">
                            Welcome back to Astra Chat
                        </h2>
                        <p className="text-slate-200/80 max-w-md">
                            Crisp typography, soft gradients, and a focus on
                            clarity make every conversation feel intentional.
                        </p>
                    </div>
                    <div className="relative grid grid-cols-2 gap-3 text-sm text-slate-100/80">
                        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.14em] text-slate-200/60">
                                Signal
                            </p>
                            <p className="text-lg font-semibold">
                                Realtime STOMP
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.14em] text-slate-200/60">
                                Identity
                            </p>
                            <p className="text-lg font-semibold">JWT Session</p>
                        </div>
                    </div>
                </div>

                <form
                    className="relative flex flex-col gap-6 p-10 bg-slate-950/60 backdrop-blur"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="space-y-2">
                        <p className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-4 py-1 text-xs font-medium text-cyan-200 border border-white/10">
                            Login
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </p>
                        <h2 className="text-2xl font-semibold text-white">
                            Enter the workspace
                        </h2>
                        <p className="text-slate-300 text-sm">
                            Use your credentials to continue the conversation.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-slate-200"
                        >
                            Email
                        </label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                            })}
                            id="email"
                            type="email"
                            placeholder="you@email.com"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 shadow-inner focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        />
                        {errors.email && (
                            <p className="text-sm text-amber-300">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-slate-200"
                        >
                            Password
                        </label>
                        <input
                            {...register("password", {
                                required: "Password is required",
                            })}
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 shadow-inner focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        />
                        {errors.password && (
                            <p className="text-sm text-amber-300">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="mt-2 inline-flex justify-center items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 px-5 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:shadow-emerald-400/30"
                    >
                        Continue
                    </button>

                    <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>Need an account?</span>
                        <Link
                            to="/signup"
                            className="font-semibold text-cyan-300 hover:text-cyan-200"
                        >
                            Create one
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
