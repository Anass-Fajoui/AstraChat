import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axios from "axios"

type FormValue = {
    email: string,
    password: string
}

const LoginPage = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<FormValue>()
    const navigate = useNavigate();
    const onSubmit= async (data: FormValue) => {
        const response = await axios.post("http://localhost:8080/api/auth/login", data);
        const token = response.data;
        localStorage.setItem("token", token);
        navigate("/chat")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
            <form className="bg-white p-6 rounded-3xl shadow-xl w-96 flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome Back</h2>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-gray-600 font-medium">
                        Email
                    </label>
                    <input
                        {...register("email", {required: "Email is required"})}
                        id="email"
                        type="text"
                        placeholder="Enter your email"
                        className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-gray-600 font-medium">
                        Password
                    </label>
                    <input
                        {...register("password", {required: "Password is required"})}
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    className="py-3 mt-2 bg-blue-500 text-white font-semibold rounded-2xl hover:bg-blue-600 transition cursor-pointer"
                >
                    Login
                </button>
                <a href="/signup" className="text-center">Don't have an account ?</a>
            </form>
        </div>
    );
};


export default LoginPage;
