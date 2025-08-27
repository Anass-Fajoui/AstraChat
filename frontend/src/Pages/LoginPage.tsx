import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
            <form
                className="bg-white p-6 rounded-3xl shadow-xl w-96 flex flex-col gap-2"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="text-2xl font-bold text-gray-800 text-center">
                    Welcome Back
                </h2>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="email"
                        className="text-gray-600 font-medium"
                    >
                        Email
                    </label>
                    <input
                        {...register("email", {
                            required: "Email is required",
                        })}
                        id="email"
                        type="text"
                        placeholder="Enter your email"
                        className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {errors.email && (
                        <p className="text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="password"
                        className="text-gray-600 font-medium"
                    >
                        Password
                    </label>
                    <input
                        {...register("password", {
                            required: "Password is required",
                        })}
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {errors.password && (
                        <p className="text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="py-3 mt-2 bg-blue-500 text-white font-semibold rounded-2xl hover:bg-blue-600 transition cursor-pointer"
                >
                    Login
                </button>
                <a href="/signup" className="text-center">
                    Don't have an account ?
                </a>
            </form>
        </div>
    );
};

export default LoginPage;
