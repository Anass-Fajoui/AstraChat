import { useContext, useEffect, useRef, useState, type FormEvent } from "react";
import type { Message, User } from "../types/types";
import MessageItem from "./MessageItem";
import { StompClientContext } from "../Context/StompClientContext";
import { useNavigate, useParams } from "react-router";
import { fetchConversationMessages, fetchUser } from "../api/api";
import { getStoredUser } from "../utils/Storage";
import { NewMessageContext } from "../Context/NewMessageContext";
import { useMessages } from "../Hooks/useMessages";
import { useUsers } from "../Hooks/useUsers";
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
    
    const {messages, setMessages, messagesLoading, messagesError} = useMessages(receiverId, newMessage);
    const {user: receiverUser, userLoading, userError} = useUser(receiverId);

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
        <div className="flex-1 bg-gray-100">
            <div className="bg-gray-700 text-white text-2xl py-3 px-5 font-bold">
                {receiverUser ? receiverUser.name : "Name"}
            </div>
            <div className="">
                <div
                    className="bg-gray-200 h-101 overflow-y-auto py-3 px-5"
                    ref={containerRef}
                >
                    {messages.map((msg) => (
                        <MessageItem
                            key={msg.id}
                            message={msg}
                            receiverName={receiverUser?.name}
                        />
                    ))}
                    {messages.length === 0 ? (
                        <p className="text-2xl text-gray-500 h-full flex justify-center items-center">
                            There are no Messages
                        </p>
                    ) : (
                        ""
                    )}
                </div>
                <form
                    className="flex justify-between px-30 m-2"
                    onSubmit={(event) => sendMessage(event)}
                >
                    <input
                        type="text"
                        className="bg-gray-300 flex-1 px-4 py-2 rounded-2xl outline-none mr-5 hover:bg-gray-400 transition"
                        ref={inputRef}
                    />
                    <button
                        type="submit"
                        className="bg-gray-300 px-5 py-1 rounded-3xl cursor-pointer hover:bg-gray-400 transition"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConversationArea;
