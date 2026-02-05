import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../Hooks/useSearch";
import type { User } from "../types/types";

type SearchBarProps = {
    onUserSelect: (userId: string) => void;
};

const SearchBar = ({ onUserSelect }: SearchBarProps) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const { searchResults, searching, search, clearSearch } = useSearch();
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.trim()) {
                search(query);
                setIsOpen(true);
            } else {
                clearSearch();
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, search, clearSearch]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUserClick = (user: User) => {
        setQuery("");
        setIsOpen(false);
        clearSearch();
        onUserSelect(user.id);
        navigate(`/chat/${user.id}`);
    };

    const handleProfileClick = (userId: string) => {
        setQuery("");
        setIsOpen(false);
        clearSearch();
        navigate(`/profile/${userId}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div ref={searchRef} className="relative">
            <div className="relative">
                <svg
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: "var(--text-secondary)" }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() =>
                        query.trim() &&
                        searchResults.length > 0 &&
                        setIsOpen(true)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Search users by name or username..."
                    style={{
                        backgroundColor: "var(--input-bg)",
                        borderColor: "var(--stroke)",
                        color: "var(--input-text)",
                    }}
                    className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm placeholder-slate-400 outline-none transition focus:ring-1"
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent)";
                        e.currentTarget.style.boxShadow =
                            "0 0 0 3px rgba(14, 165, 233, 0.1)";
                        if (query.trim() && searchResults.length > 0) {
                            setIsOpen(true);
                        }
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = "var(--stroke)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                />
                {searching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div
                            className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                            style={{
                                borderColor: "var(--accent)",
                                borderTopColor: "transparent",
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (
                <div
                    className="absolute top-full left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border shadow-lg"
                    style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--stroke)",
                        color: "var(--text-primary)",
                    }}
                >
                    {searchResults.length === 0 &&
                        !searching &&
                        query.trim() && (
                            <div
                                className="px-4 py-6 text-center text-sm"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                <svg
                                    className="mx-auto mb-2 h-8 w-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    style={{
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                No users found for "{query}"
                            </div>
                        )}

                    {searchResults.map((user) => (
                        <div
                            key={user.id}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition"
                            style={{
                                backgroundColor: "var(--bg-secondary)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "var(--input-bg)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "var(--bg-secondary)";
                            }}
                        >
                            <div
                                onClick={() => handleProfileClick(user.id)}
                                className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 text-sm font-semibold"
                                style={{
                                    transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow =
                                        "0 0 0 2px var(--accent)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span style={{ color: "#0b1021" }}>
                                        {user.name.slice(0, 1).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => handleUserClick(user)}
                                className="flex-1 min-w-0 text-left"
                            >
                                <p
                                    className="font-medium truncate"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    {user.name}
                                </p>
                                <p
                                    className="text-xs truncate"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    @{user.username}
                                </p>
                            </button>
                            <button
                                onClick={() => handleUserClick(user)}
                                className="p-2 rounded-lg transition"
                                style={{
                                    color: "var(--text-secondary)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "var(--input-bg)";
                                    e.currentTarget.style.color =
                                        "var(--accent)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "transparent";
                                    e.currentTarget.style.color =
                                        "var(--text-secondary)";
                                }}
                                title="Start chat"
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
