import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../utils/Storage";
import { NewMessageContext } from "../Context/NewMessageContext";
import { useConversations } from "../Hooks/useConversations";
import SearchBar from "./SearchBar";
import type { Conversation } from "../types/types";

type UserListProps = {
    selectedConv: string;
    setSelectedConv: (s: string) => void;
};

const formatTime = (timestamp: string | null): string => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } else if (diffDays === 1) {
        return "Yesterday";
    } else if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: "short" });
    } else {
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
};

const truncateMessage = (
    message: string | null,
    maxLength: number = 30,
): string => {
    if (!message) return "No messages yet";
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
};

const UserList = ({ selectedConv, setSelectedConv }: UserListProps) => {
    const currentUser = getStoredUser();
    const navigate = useNavigate();

    const newMessageContext = useContext(NewMessageContext);
    if (!newMessageContext) {
        throw new Error("Home Page must be used inside new message provider");
    }
    const { newMessage, setNewMessage } = newMessageContext;

    const { conversations, loading, error, refreshConversations } =
        useConversations();

    // Refresh conversations when a new message arrives
    useEffect(() => {
        if (newMessage) {
            refreshConversations();
        }
    }, [newMessage, refreshConversations]);

    const handleConversationClick = (conv: Conversation) => {
        navigate(`/chat/${conv.odUserId}`);
        setSelectedConv(conv.odUserId);
        if (newMessage && newMessage.senderId === conv.odUserId) {
            setNewMessage(undefined);
        }
    };

    const handleSearchUserSelect = (userId: string) => {
        setSelectedConv(userId);
        // Refresh conversations after selecting a new user to chat with
        setTimeout(refreshConversations, 500);
    };

    return (
        <aside
            className="glass-panel flex h-full flex-col rounded-3xl p-4"
            style={{ color: "var(--text-primary)" }}
        >
            {/* Header */}
            <div className="flex items-center justify-between pb-2">
                <div>
                    <p
                        className="text-xs uppercase tracking-[0.16em] font-semibold"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Inbox
                    </p>
                    <h3 className="text-xl font-semibold mt-1">
                        Conversations
                    </h3>
                </div>
                <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                        backgroundColor: "var(--input-bg)",
                        border: "1px solid var(--stroke)",
                        color: "var(--text-secondary)",
                    }}
                >
                    {conversations.length} chats
                </span>
            </div>

            {/* Search Bar */}
            <div className="mt-3 mb-4">
                <SearchBar onUserSelect={handleSearchUserSelect} />
            </div>

            {/* Conversations List */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div
                            className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
                            style={{
                                borderColor: "var(--accent)",
                                borderTopColor: "transparent",
                            }}
                        />
                        <span
                            className="ml-2 text-sm"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Loading conversations...
                        </span>
                    </div>
                )}

                {error && (
                    <div
                        className="rounded-xl border px-4 py-3"
                        style={{
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            borderColor: "rgba(239, 68, 68, 0.2)",
                        }}
                    >
                        <p
                            className="text-sm"
                            style={{ color: "var(--error)" }}
                        >
                            {error}
                        </p>
                    </div>
                )}

                {!loading && conversations.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div
                            className="mb-4 rounded-full p-4"
                            style={{
                                backgroundColor: "var(--input-bg)",
                            }}
                        >
                            <svg
                                className="h-8 w-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                        </div>
                        <p
                            className="text-sm font-medium"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            No conversations yet
                        </p>
                        <p
                            className="mt-1 text-xs"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Search for users above to start chatting
                        </p>
                    </div>
                )}

                {conversations.map((conv) => (
                    <button
                        key={conv.odUserId}
                        className="w-full rounded-2xl px-4 py-3 text-left transition hover:-translate-y-[1px]"
                        style={{
                            backgroundColor:
                                conv.odUserId === selectedConv
                                    ? "var(--card-hover)"
                                    : "var(--input-bg)",
                            border:
                                conv.odUserId === selectedConv
                                    ? `1px solid var(--accent)`
                                    : `1px solid var(--stroke)`,
                            color: "var(--text-primary)",
                        }}
                        onMouseEnter={(e) => {
                            if (conv.odUserId !== selectedConv) {
                                e.currentTarget.style.backgroundColor =
                                    "var(--card-hover)";
                                e.currentTarget.style.borderColor =
                                    "var(--stroke-strong)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (conv.odUserId !== selectedConv) {
                                e.currentTarget.style.backgroundColor =
                                    "var(--input-bg)";
                                e.currentTarget.style.borderColor =
                                    "var(--stroke)";
                            }
                        }}
                        onClick={() => handleConversationClick(conv)}
                    >
                        <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 text-sm font-semibold">
                                {conv.avatarUrl ? (
                                    <img
                                        src={conv.avatarUrl}
                                        alt={conv.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span style={{ color: "#0b1021" }}>
                                        {conv.name.slice(0, 1).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p
                                        className="font-semibold truncate"
                                        style={{
                                            color: "var(--text-primary)",
                                        }}
                                    >
                                        {conv.name}
                                    </p>
                                    {conv.lastMessageTime && (
                                        <span
                                            className="shrink-0 text-xs"
                                            style={{
                                                color: "var(--text-secondary)",
                                            }}
                                        >
                                            {formatTime(conv.lastMessageTime)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between gap-2 mt-0.5">
                                    <p
                                        className="text-xs truncate"
                                        style={{
                                            color: "var(--text-secondary)",
                                        }}
                                    >
                                        {conv.lastMessageSenderId ===
                                            currentUser.id && (
                                            <span
                                                style={{
                                                    color: "var(--text-muted)",
                                                }}
                                            >
                                                You:{" "}
                                            </span>
                                        )}
                                        {truncateMessage(conv.lastMessage)}
                                    </p>
                                    {newMessage &&
                                    newMessage.senderId === conv.odUserId ? (
                                        <span
                                            className="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
                                            style={{
                                                backgroundColor:
                                                    "var(--warning)",
                                                color: "#ffffff",
                                            }}
                                        >
                                            New
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    );
};

export default UserList;
