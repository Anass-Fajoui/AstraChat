import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StompClientContext } from "../Context/StompClientContext";
import { useTheme } from "../Context/ThemeContext";
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
    const { theme, toggleTheme } = useTheme();

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
                className="flex items-center gap-4 hover:cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => {
                    setSelectedConv("");
                    navigate("/chat");
                }}
                style={{ color: "var(--text-primary)" }}
            >
                <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 font-semibold shadow-lg">
                    {user?.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span style={{ color: "#0b1021" }}>
                            {displayName.slice(0, 1).toUpperCase()}
                        </span>
                    )}
                </div>
                <div className="space-y-1">
                    <p
                        className="text-lg font-semibold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {displayName}
                    </p>
                    <p
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        @{displayUsername}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="inline-flex items-center justify-center rounded-2xl p-2 text-sm font-semibold transition"
                    style={{
                        backgroundColor: "var(--input-bg)",
                        border: "1px solid var(--stroke)",
                        color: "var(--text-primary)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                            "var(--card-hover)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                            "var(--input-bg)";
                    }}
                    title={
                        theme === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                >
                    {theme === "dark" ? (
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
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    ) : (
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
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                        </svg>
                    )}
                </button>
                <button
                    onClick={() => navigate("/settings")}
                    className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition"
                    style={{
                        backgroundColor: "var(--input-bg)",
                        border: "1px solid var(--stroke)",
                        color: "var(--text-primary)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                            "var(--card-hover)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                            "var(--input-bg)";
                    }}
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
                    className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition"
                    style={{
                        backgroundColor: "var(--error)",
                        color: "#ffffff",
                        border: "1px solid var(--error)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                            "var(--error-light)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--error)";
                    }}
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
