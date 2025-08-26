import { useContext } from "react";
import { StompClientContext } from "../Context/StompClientContext";
import { useNavigate } from "react-router";
import { getStoredUser } from "../utils/Storage";


const Header = () => {
    const navigate = useNavigate();
    const storedUser = getStoredUser();
    const stompContext = useContext(StompClientContext);

    if (!stompContext){
        throw new Error("the stomp context must be provided");
    }
    const {stompClient, setStompClient} = stompContext;

    function logout() {
        stompClient?.deactivate();
        localStorage.setItem("token", "");
        localStorage.setItem("user", "");
        navigate("/login");
    }
    
    return (
        <div className="flex items-center justify-between px-6 py-3 bg-blue-400 ">
            <div className="text-white text-2xl bg-green-500 px-3 py-2 rounded-3xl hover:cursor-pointer" onClick={() => navigate("/chat")}> {storedUser.name} </div>
            <button
                className="bg-red-500 py-2 px-3 rounded-3xl text-white transition hover:bg-red-600 cursor-pointer"
                onClick={logout}
            >
                Logout
            </button>
        </div>
    );
};

export default Header;
