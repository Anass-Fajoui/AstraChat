import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../utils/Storage";
import {
    fetchProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
    deleteAvatar,
} from "../api/api";
import type { User } from "../types/types";

const SettingsPage = () => {
    const navigate = useNavigate();
    const storedUser = getStoredUser();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");

    // Password change
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Messages
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const profile = await fetchProfile(storedUser.id);
            setUser(profile);
            setName(profile.name);
            setUsername(profile.username);
            setEmail(profile.email);
            setBio(profile.bio || "");
        } catch (error) {
            setErrorMessage("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const updatedUser = await updateProfile(storedUser.id, {
                name,
                username,
                email,
                bio,
            });
            setUser(updatedUser);

            // Update stored user in localStorage
            const storedData = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...storedData,
                    name: updatedUser.name,
                    username: updatedUser.username,
                    email: updatedUser.email,
                }),
            );

            setSuccessMessage("Profile updated successfully!");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            setErrorMessage(
                err.response?.data?.error || "Failed to update profile",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (newPassword !== confirmPassword) {
            setErrorMessage("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage("Password must be at least 6 characters");
            return;
        }

        setSaving(true);

        try {
            await changePassword(storedUser.id, {
                currentPassword,
                newPassword,
            });
            setSuccessMessage("Password changed successfully!");
            setShowPasswordForm(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            setErrorMessage(
                err.response?.data?.error || "Failed to change password",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAvatar(true);
        setErrorMessage("");

        try {
            const updatedUser = await uploadAvatar(storedUser.id, file);
            setUser(updatedUser);
            setSuccessMessage("Avatar updated successfully!");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            setErrorMessage(
                err.response?.data?.error || "Failed to upload avatar",
            );
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleDeleteAvatar = async () => {
        if (!user?.avatarUrl) return;

        setUploadingAvatar(true);
        setErrorMessage("");

        try {
            await deleteAvatar(storedUser.id);
            setUser({ ...user, avatarUrl: undefined });
            setSuccessMessage("Avatar removed successfully!");
        } catch (error) {
            setErrorMessage("Failed to remove avatar");
        } finally {
            setUploadingAvatar(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex items-center gap-3 text-slate-700 dark:text-white">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-sky-900 dark:text-white">
                        Settings
                    </h1>
                    <button
                        onClick={() => navigate("/chat")}
                        className="flex items-center gap-2 rounded-xl bg-cyan-100 dark:bg-white/10 px-4 py-2 text-cyan-700 dark:text-white transition hover:bg-cyan-200 dark:hover:bg-white/20"
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
                        Back to Chat
                    </button>
                </div>

                {/* Messages */}
                {successMessage && (
                    <div className="mb-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-3 text-emerald-300">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-4 rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-3 text-red-300">
                        {errorMessage}
                    </div>
                )}

                {/* Avatar Section */}
                <div className="glass-panel mb-6 rounded-2xl p-6">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                        Profile Picture
                    </h2>
                    <div className="flex items-center gap-6">
                        <div
                            onClick={handleAvatarClick}
                            className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 transition hover:opacity-80"
                        >
                            {user?.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt="Avatar"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-slate-900">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            {uploadingAvatar && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleAvatarClick}
                                disabled={uploadingAvatar}
                                className="rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-600 dark:text-cyan-300 transition hover:bg-cyan-500/20 dark:hover:bg-cyan-500/30 disabled:opacity-50"
                            >
                                Upload New Photo
                            </button>
                            {user?.avatarUrl && (
                                <button
                                    onClick={handleDeleteAvatar}
                                    disabled={uploadingAvatar}
                                    className="rounded-xl bg-red-500/10 dark:bg-red-500/20 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-300 transition hover:bg-red-500/20 dark:hover:bg-red-500/30 disabled:opacity-50"
                                >
                                    Remove Photo
                                </button>
                            )}
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                JPG, PNG or GIF. Max 5MB.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <form
                    onSubmit={handleSaveProfile}
                    className="glass-panel mb-6 rounded-2xl p-6"
                >
                    <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                        Profile Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-400 focus:bg-white dark:focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                                placeholder="Your display name"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-400 focus:bg-white dark:focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                                placeholder="@username"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-400 focus:bg-white dark:focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                Bio
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-400 focus:bg-white dark:focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 resize-none"
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </form>

                {/* Password Section */}
                <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Password
                        </h2>
                        <button
                            onClick={() =>
                                setShowPasswordForm(!showPasswordForm)
                            }
                            className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                        >
                            {showPasswordForm ? "Cancel" : "Change Password"}
                        </button>
                    </div>

                    {showPasswordForm && (
                        <form
                            onSubmit={handleChangePassword}
                            className="mt-4 space-y-4"
                        >
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-400 focus:bg-white dark:focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-400 focus:bg-white dark:focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-400 focus:bg-white dark:focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                            >
                                {saving ? "Changing..." : "Change Password"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
