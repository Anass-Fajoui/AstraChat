import { useContext } from "react";
import { useNavigate } from "react-router";
import { StompClientContext } from "../Context/StompClientContext";
import { getStoredUser } from "../utils/Storage";

type HeaderProps = {
    setSelectedConv: (s: string) => void;
};

const Header = ({ setSelectedConv }: HeaderProps) => {
    const navigate = useNavigate();
    const storedUser = getStoredUser();
    const stompContext = useContext(StompClientContext);

    if (!stompContext) {
        throw new Error("the stomp context must be provided");
    }
    const { stompClient } = stompContext;

    function logout() {
        stompClient?.deactivate();
        localStorage.setItem("token", "");
        localStorage.setItem("user", "");
        navigate("/login");
    }

    return (
        <header className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-3xl px-6 py-4">
            <div
                className="flex items-center gap-4 hover:cursor-pointer"
                onClick={() => {
                    setSelectedConv("");
                    navigate("/chat");
                }}
            >
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-900 font-semibold shadow-lg">
                    {storedUser.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="space-y-1">
                    <p className="text-lg font-semibold text-white">{storedUser.name}</p>
                    <p className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Connected as {storedUser.username}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                    <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    Live relay via STOMP
                </div>
                <button
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/20 border border-white/10 transition hover:bg-red-500/80 hover:text-slate-950"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
