import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

type FormValue = {
    name: string,
    username: string,
    email: string,
    password: string
}

const SignUpPage = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<FormValue>()
    const navigate = useNavigate();
    const onSubmit= async (data: FormValue) => {
        const response = await axios.post("http://localhost:8080/api/auth/login", data);
        const token = response.data;
        localStorage.setItem("token", token)
        navigate("/chat")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
            <form className="bg-white p-6 rounded-3xl shadow-xl w-96 flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome</h2>
                
                <div className="flex flex-col gap-1">
                    <label htmlFor="username" className="text-gray-600 font-medium">
                        Name
                    </label>
                    <input
                        {...register("name", {required: "Name is required"})}
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="username" className="text-gray-600 font-medium">
                        Username
                    </label>
                    <input
                        {...register("username", {required: "Username is required"})}
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                </div>

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
                    Register
                </button>
                <a href="/login" className="text-center">Already have a account ?</a>
            </form>
        </div>
    );
};


export default SignUpPage;
