import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StompClientContext } from "../Context/StompClientContext";
import { getStoredUser } from "../utils/Storage";
import { fetchProfile } from "../api/api";
import type { User } from "../types/types";

type HeaderProps = {
    setSelectedConv: (s: string) => void;
};

const Header = ({ setSelectedConv }: HeaderProps) => {
    const navigate = useNavigate();
    const storedUser = getStoredUser();
    const stompContext = useContext(StompClientContext);
    const [user, setUser] = useState<User | null>(null);

    if (!stompContext) {
        throw new Error("the stomp context must be provided");
    }
    const { stompClient } = stompContext;

    useEffect(() => {
        // Fetch user profile to get avatar
        fetchProfile(storedUser.id).then(setUser).catch(console.error);
    }, [storedUser.id]);

    function logout() {
        stompClient?.deactivate();
        localStorage.setItem("token", "");
        localStorage.setItem("user", "");
        navigate("/login");
    }

    const displayName = user?.name || storedUser.name;
    const displayUsername = user?.username || storedUser.username;

    return (
        <header className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-3xl px-6 py-4">
            <div
                className="flex items-center gap-4 hover:cursor-pointer"
                onClick={() => {
                    setSelectedConv("");
                    navigate("/chat");
                }}
            >
                <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-900 font-semibold shadow-lg">
                    {user?.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        displayName.slice(0, 1).toUpperCase()
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-lg font-semibold text-white">
                        {displayName}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Connected as {displayUsername}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate("/settings")}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg border border-white/10 transition hover:bg-white/20"
                    title="Settings"
                >
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    <span className="hidden sm:inline">Settings</span>
                </button>
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
