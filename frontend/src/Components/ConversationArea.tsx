import { useContext, useEffect, useRef, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Message } from "../types/types";
import MessageItem from "./MessageItem";
import { StompClientContext } from "../Context/StompClientContext";
import { getStoredUser } from "../utils/Storage";
import { NewMessageContext } from "../Context/NewMessageContext";
import { useMessages } from "../Hooks/useMessages";
import { useUser } from "../Hooks/useUser";

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

    const { messages, setMessages, messagesLoading, messagesError } =
        useMessages(receiverId, newMessage);
    const { user: receiverUser, userLoading, userError } = useUser(receiverId);

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
        <div className="flex h-full flex-col text-slate-100">
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-800/60 px-6 py-4">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Chatting with
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400">
                            {receiverUser?.avatarUrl ? (
                                <img
                                    src={receiverUser.avatarUrl}
                                    alt={receiverUser.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center font-semibold text-slate-900">
                                    {receiverUser?.name
                                        ?.charAt(0)
                                        .toUpperCase() || "?"}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-lg font-semibold">
                                {receiverUser ? receiverUser.name : "Loading"}
                            </p>
                            <p className="text-xs text-slate-400">
                                {receiverUser
                                    ? `@${receiverUser.username}`
                                    : ""}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                    <button
                        onClick={() => navigate(`/profile/${receiverId}`)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-slate-200 transition hover:border-cyan-400/60 hover:text-white"
                    >
                        View Profile
                    </button>
                    <button
                        onClick={() => navigate("/chat")}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-slate-200 transition hover:border-cyan-400/60 hover:text-white"
                    >
                        Back to list
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden bg-slate-900/50">
                <div
                    className="flex h-full flex-col gap-3 overflow-y-auto px-6 py-6"
                    ref={containerRef}
                >
                    {messagesLoading && (
                        <p className="text-sm text-slate-300">
                            Loading messages...
                        </p>
                    )}
                    {messagesError && (
                        <p className="text-sm text-amber-300">
                            {messagesError}
                        </p>
                    )}
                    {!messagesLoading && messages.length === 0 && (
                        <p className="text-center text-slate-400">
                            There are no messages yet. Say hi!
                        </p>
                    )}
                    {messages.map((msg) => (
                        <MessageItem
                            key={msg.id}
                            message={msg}
                            receiverName={receiverUser?.name}
                        />
                    ))}
                </div>
            </div>

            <form
                className="flex items-center gap-3 border-t border-white/10 bg-slate-900/80 px-4 py-4"
                onSubmit={(event) => sendMessage(event)}
            >
                <input
                    type="text"
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 shadow-inner focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                    ref={inputRef}
                    placeholder="Type a message..."
                />
                <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:shadow-emerald-400/30"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ConversationArea;
