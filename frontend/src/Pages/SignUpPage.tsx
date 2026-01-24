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

    const onSubmit = async (data: RegisterFormValue) => {
        try {
            let response = await Register(data);
            localStorage.setItem("token", response.token);
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: response.id,
                    name: response.name,
                    username: response.username,
                    email: response.email,
                })
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
            <div className="glass-panel w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1.05fr_1fr] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-emerald-400/25 via-cyan-500/25 to-blue-500/20">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_25%_20%,rgba(16,185,129,0.38),transparent_38%),radial-gradient(circle_at_75%_30%,rgba(14,165,233,0.32),transparent_32%)]" />
                    <div className="relative space-y-4">
                        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-emerald-50 border border-white/15">
                            Create your space
                        </p>
                        <h2 className="text-3xl font-semibold text-slate-50 leading-tight">
                            Onboard to Astra Chat
                        </h2>
                        <p className="text-slate-200/80 max-w-md">
                            Set up your identity and jump into fluid, real-time conversations with a polished interface.
                        </p>
                    </div>
                    <div className="relative grid grid-cols-2 gap-3 text-sm text-slate-100/80">
                        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.14em] text-slate-200/60">Session</p>
                            <p className="text-lg font-semibold">Persistent Login</p>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.14em] text-slate-200/60">Delivery</p>
                            <p className="text-lg font-semibold">Realtime Streams</p>
                        </div>
                    </div>
                </div>

                <form
                    className="relative flex flex-col gap-6 p-10 bg-slate-950/60 backdrop-blur"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="space-y-2">
                        <p className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-4 py-1 text-xs font-medium text-emerald-200 border border-white/10">
                            Sign Up
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        </p>
                        <h2 className="text-2xl font-semibold text-white">Create an account</h2>
                        <p className="text-slate-300 text-sm">We will set up your profile and keep you logged in.</p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-slate-200">
                            Name
                        </label>
                        <input
                            {...register("name", { required: "Name is required" })}
                            id="name"
                            type="text"
                            placeholder="Jane Doe"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 shadow-inner focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                        {errors.name && (
                            <p className="text-sm text-amber-300">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium text-slate-200">
                            Username
                        </label>
                        <input
                            {...register("username", {
                                required: "Username is required",
                            })}
                            id="username"
                            type="text"
                            placeholder="astrofan"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 shadow-inner focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                        {errors.username && (
                            <p className="text-sm text-amber-300">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-200">
                            Email
                        </label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                            })}
                            id="email"
                            type="email"
                            placeholder="you@email.com"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 shadow-inner focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                        {errors.email && (
                            <p className="text-sm text-amber-300">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-slate-200">
                            Password
                        </label>
                        <input
                            {...register("password", {
                                required: "Password is required",
                            })}
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 shadow-inner focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                        {errors.password && (
                            <p className="text-sm text-amber-300">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="mt-2 inline-flex justify-center items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-5 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-emerald-400/30 transition hover:shadow-cyan-500/30"
                    >
                        Create account
                    </button>

                    <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>Already registered?</span>
                        <Link to="/login" className="font-semibold text-emerald-300 hover:text-emerald-200">
                            Go to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
