import { useContext, useRef, type FormEvent } from "react";
import type { Message } from "../types/types";
import MessageItem from "./MessageItem";
import type { Client } from "@stomp/stompjs";
import { StompClientContext } from "../Context/StompClientContext";

interface ChatAreaProps {
    messages: Message[];
}

const ChatArea = ({ messages }: ChatAreaProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const username = localStorage.getItem("username");

    const stompContext = useContext(StompClientContext);
    if (!stompContext) {
        throw new Error("ChatPage must be used inside provider");
    }
    const { stompClient, setStompClient } = stompContext;

    function sendMessage(event: FormEvent) {
        event.preventDefault();
        if (inputRef.current && inputRef.current.value) {
            stompClient?.publish({
                destination: "/app/chat.sendMessage",
                body: JSON.stringify({
                    sender: username,
                    content: inputRef.current.value,
                    type: "CHAT",
                }),
            });
            inputRef.current.value = "";
        }
    }

    return (
        <div className="flex-1 flex justify-center items-center bg-gray-100 p-4">
            <div className="max-w-[700px] w-full">
                <div className="bg-gray-200 h-100 rounded-3xl overflow-y-auto p-3 flex-col">
                    {messages.map((msg) => (
                        <MessageItem message={msg} />
                    ))}
                </div>
                <form
                    className="flex justify-between px-3 mt-2"
                    onSubmit={(event) => sendMessage(event)}
                >
                    <input
                        type="text"
                        className="bg-gray-300 flex-1 px-4 py-2 rounded-2xl outline-none mr-5"
                        ref={inputRef}
                    />
                    <button
                        type="submit"
                        className="bg-gray-300 px-5 py-1 rounded-3xl transition cursor-pointer hover:bg-gray-400"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatArea;
