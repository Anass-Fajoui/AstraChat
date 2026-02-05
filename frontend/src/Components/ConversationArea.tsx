import { useContext, useEffect, useRef, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Message } from "../types/types";
import MessageItem from "./MessageItem";
import { StompClientContext } from "../Context/StompClientContext";
import { getStoredUser } from "../utils/Storage";
import { NewMessageContext } from "../Context/NewMessageContext";
import { OnlineStatusContext } from "../Context/OnlineStatusContext";
import { useMessages } from "../Hooks/useMessages";
import { useUser } from "../Hooks/useUser";

// Helper function to format date separator
const formatDateSeparator = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time for comparison
    const dateOnly = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    );
    const todayOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );
    const yesterdayOnly = new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate(),
    );

    if (dateOnly.getTime() === todayOnly.getTime()) {
        return "Today";
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return "Yesterday";
    } else {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
};

// Helper function to get date string (YYYY-MM-DD) for grouping
const getDateKey = (timestamp?: string): string => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

// Helper function to format last seen time
const formatLastSeen = (lastSeenStr?: string): string => {
    if (!lastSeenStr) return "Unknown";

    const lastSeen = new Date(lastSeenStr);
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
        return "Just now";
    } else if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays === 1) {
        return "Yesterday";
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        const day = lastSeen.getDate().toString().padStart(2, "0");
        const month = (lastSeen.getMonth() + 1).toString().padStart(2, "0");
        const year = lastSeen.getFullYear();
        return `${day}/${month}/${year}`;
    }
};

const ConversationArea = () => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const currentUser = getStoredUser();
    const { receiverId } = useParams();

    const stompContext = useContext(StompClientContext);
    if (!stompContext) {
        throw new Error("ChatPage must be used inside provider");
    }
    const { stompClient } = stompContext;

    const newMessageContext = useContext(NewMessageContext);
    if (!newMessageContext) {
        throw new Error("Home Page must be used inside new message provider");
    }
    const { newMessage, setNewMessage } = newMessageContext;

    const onlineStatusContext = useContext(OnlineStatusContext);
    const { onlineStatuses } = onlineStatusContext || {
        onlineStatuses: new Map(),
    };

    const { messages, setMessages, messagesLoading, messagesError } =
        useMessages(receiverId, newMessage);
    const { user: receiverUser, userLoading, userError } = useUser(receiverId);

    // Get online status - prefer realtime updates, fallback to user data from API
    const realtimeStatus = receiverId
        ? onlineStatuses.get(receiverId)
        : undefined;
    const isOnline = realtimeStatus?.isOnline ?? receiverUser?.online ?? false;
    const lastSeen = realtimeStatus?.lastSeen ?? receiverUser?.lastSeen;

    useEffect(() => {
        if (newMessage && newMessage.senderId === receiverId) {
            setNewMessage(undefined);
        }
    }, [newMessage, receiverId, setNewMessage]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    function sendMessage(event: FormEvent) {
        event.preventDefault();

        if (inputRef.current && inputRef.current.value) {
            const message: Message = {
                id: "",
                chatId: "",
                senderId: currentUser.id,
                receiverId: receiverId ? receiverId : "",
                content: inputRef.current.value,
            };
            stompClient?.publish({
                destination: "/app/chat",
                body: JSON.stringify({
                    senderId: currentUser.id,
                    receiverId: receiverId,
                    content: inputRef.current.value,
                }),
            });
            inputRef.current.value = "";
            setMessages((prev) => [...prev, message]);
        }
    }

    return (
        <div
            className="flex h-full flex-col"
            style={{ color: "var(--text-primary)" }}
        >
            <div
                className="flex items-center justify-between border-b px-6 py-4"
                style={{
                    borderColor: "var(--stroke)",
                    backgroundColor: "var(--bg-secondary)",
                }}
            >
                <div className="space-y-1">
                    <p
                        className="text-xs uppercase tracking-[0.18em] font-semibold"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Chatting with
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="h-10 w-10 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400">
                                {receiverUser?.avatarUrl ? (
                                    <img
                                        src={receiverUser.avatarUrl}
                                        alt={receiverUser.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className="flex h-full w-full items-center justify-center font-semibold"
                                        style={{ color: "#0b1021" }}
                                    >
                                        {receiverUser?.name
                                            ?.charAt(0)
                                            .toUpperCase() || "?"}
                                    </div>
                                )}
                            </div>
                            {/* Online indicator */}
                            <span
                                className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2"
                                style={{
                                    borderColor: "var(--bg-secondary)",
                                    backgroundColor: isOnline
                                        ? "var(--success)"
                                        : "var(--text-muted)",
                                }}
                            />
                        </div>
                        <div>
                            <p
                                className="text-lg font-semibold"
                                style={{ color: "var(--text-primary)" }}
                            >
                                {receiverUser ? receiverUser.name : "Loading"}
                            </p>
                            <p
                                className="text-xs"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                {isOnline ? (
                                    <span style={{ color: "var(--success)" }}>
                                        Online
                                    </span>
                                ) : (
                                    <span>
                                        Last seen {formatLastSeen(lastSeen)}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <button
                        onClick={() => navigate(`/profile/${receiverId}`)}
                        className="rounded-2xl px-3 py-1 transition"
                        style={{
                            border: "1px solid var(--stroke)",
                            backgroundColor: "var(--input-bg)",
                            color: "var(--text-secondary)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "var(--card-hover)";
                            e.currentTarget.style.borderColor =
                                "var(--stroke-strong)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "var(--input-bg)";
                            e.currentTarget.style.borderColor = "var(--stroke)";
                        }}
                    >
                        View Profile
                    </button>
                    <button
                        onClick={() => navigate("/chat")}
                        className="rounded-2xl px-3 py-1 transition"
                        style={{
                            border: "1px solid var(--stroke)",
                            backgroundColor: "var(--input-bg)",
                            color: "var(--text-secondary)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "var(--card-hover)";
                            e.currentTarget.style.borderColor =
                                "var(--stroke-strong)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "var(--input-bg)";
                            e.currentTarget.style.borderColor = "var(--stroke)";
                        }}
                    >
                        Back to list
                    </button>
                </div>
            </div>

            <div
                className="flex-1 overflow-hidden"
                style={{ backgroundColor: "var(--bg)" }}
            >
                <div
                    className="flex h-full flex-col gap-3 overflow-y-auto px-6 py-6"
                    ref={containerRef}
                >
                    {messagesLoading && (
                        <p
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Loading messages...
                        </p>
                    )}
                    {messagesError && (
                        <p
                            className="text-sm"
                            style={{ color: "var(--error)" }}
                        >
                            {messagesError}
                        </p>
                    )}
                    {!messagesLoading && messages.length === 0 && (
                        <p
                            className="text-center"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            There are no messages yet. Say hi!
                        </p>
                    )}
                    {messages.map((msg, index) => {
                        const currentDateKey = getDateKey(msg.timestamp);
                        const prevDateKey =
                            index > 0
                                ? getDateKey(messages[index - 1].timestamp)
                                : null;
                        const showDateSeparator =
                            currentDateKey && currentDateKey !== prevDateKey;
                        const prevMessage =
                            index > 0 ? messages[index - 1] : null;
                        const showName =
                            !prevMessage ||
                            prevMessage.senderId !== msg.senderId ||
                            showDateSeparator;

                        return (
                            <div key={msg.id || index}>
                                {showDateSeparator && (
                                    <div className="flex items-center gap-4 my-4">
                                        <div
                                            className="flex-1 h-px"
                                            style={{
                                                backgroundColor:
                                                    "var(--stroke)",
                                            }}
                                        />
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-medium border"
                                            style={{
                                                backgroundColor:
                                                    "var(--input-bg)",
                                                borderColor: "var(--stroke)",
                                                color: "var(--text-secondary)",
                                            }}
                                        >
                                            {formatDateSeparator(
                                                msg.timestamp!,
                                            )}
                                        </span>
                                        <div
                                            className="flex-1 h-px"
                                            style={{
                                                backgroundColor:
                                                    "var(--stroke)",
                                            }}
                                        />
                                    </div>
                                )}
                                <MessageItem
                                    message={msg}
                                    receiverName={receiverUser?.name}
                                    showName={showName}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <form
                className="flex items-center gap-3 border-t px-4 py-4"
                style={{
                    borderColor: "var(--stroke)",
                    backgroundColor: "var(--bg-secondary)",
                }}
                onSubmit={(event) => sendMessage(event)}
            >
                <input
                    type="text"
                    className="flex-1 rounded-2xl border px-4 py-3 outline-none transition"
                    style={{
                        backgroundColor: "var(--input-bg)",
                        borderColor: "var(--stroke)",
                        color: "var(--input-text)",
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent)";
                        e.currentTarget.style.boxShadow =
                            "0 0 0 3px rgba(14, 165, 233, 0.1)";
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = "var(--stroke)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                    ref={inputRef}
                    placeholder="Type a message..."
                />
                <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white transition"
                    style={{
                        background:
                            "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
                        boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                            "0 6px 16px rgba(14, 165, 233, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(14, 165, 233, 0.3)";
                    }}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ConversationArea;
