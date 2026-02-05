import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUser } from "../api/api";
import type { User } from "../types/types";

const UserProfilePage = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (userId) {
            loadUser();
        }
    }, [userId]);

    const loadUser = async () => {
        try {
            const profile = await fetchUser(userId);
            setUser(profile);
        } catch (err) {
            setError("Failed to load user profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="flex items-center gap-3 text-white">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                    Loading profile...
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center">
                    <p className="text-red-400 mb-4">
                        {error || "User not found"}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/20"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
            <div className="mx-auto max-w-lg">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
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
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back
                </button>

                {/* Profile Card */}
                <div className="glass-panel rounded-3xl p-8 text-center">
                    {/* Avatar */}
                    <div className="mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 shadow-xl shadow-cyan-500/20">
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-slate-900">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Name */}
                    <h1 className="mb-1 text-2xl font-bold text-white">
                        {user.name}
                    </h1>

                    {/* Username */}
                    <p className="mb-4 text-slate-400">@{user.username}</p>

                    {/* Bio */}
                    {user.bio && (
                        <div className="mb-6 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                            <p className="text-slate-300">{user.bio}</p>
                        </div>
                    )}

                    {/* Email */}
                    <div className="mb-6 flex items-center justify-center gap-2 text-slate-400">
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        <span className="text-sm">{user.email}</span>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => navigate(`/chat/${user.id}`)}
                        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 font-semibold text-white transition hover:opacity-90"
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
