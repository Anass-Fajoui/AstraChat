import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

type FormValue = {
    username: string
}

const LoginPage = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<FormValue>()
    const navigate = useNavigate();
    const onSubmit= (data: FormValue) => {
        localStorage.setItem("username", data.username)
        navigate("/chat")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
            <form className="bg-white p-8 rounded-3xl shadow-xl w-96 flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome Back</h2>
                
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

                <button
                    type="submit"
                    className="py-3 bg-blue-500 text-white font-semibold rounded-2xl hover:bg-blue-600 transition cursor-pointer"
                >
                    Login
                </button>
            </form>
        </div>
    );
};


export default LoginPage;
