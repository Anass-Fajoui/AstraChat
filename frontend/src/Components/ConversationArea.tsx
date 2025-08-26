import { useContext, useEffect, useRef, useState, type FormEvent } from "react";
import type { Message, User } from "../types/types";
import MessageItem from "./MessageItem";
import { StompClientContext } from "../Context/StompClientContext";
import { useNavigate, useParams } from "react-router";
import { fetchConversationMessages, fetchUser } from "../api/users";
import { getStoredUser } from "../utils/Storage";

const ConversationArea = () => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const currentUser = getStoredUser();
    const { receiverId } = useParams();
    const [receiverUser, setReceiverUser] = useState<User | undefined>(undefined)

    const stompContext = useContext(StompClientContext);
    if (!stompContext) {
        throw new Error("ChatPage must be used inside provider");
    }
    const { stompClient} = stompContext;

    useEffect(() => {
        const fetchMessages = async () => {
            if (!receiverId) {
                throw new Error("there is no id in url");
            }
            try {
                const data = await fetchConversationMessages(receiverId);
                setMessages(data);
            } catch (error: any) {
                if (error.response) {
                    if (error.response.code === "403") {
                        navigate("/login");
                    }
                    alert(
                        `Error fetching the messages : ${error.response.data.message}`
                    );
                } else {
                    alert(`Error fetching the messages`);
                }
            }
            try{
                const data = await fetchUser(receiverId);
                setReceiverUser(data);
            } catch (error: any){
                if (error.response) {
                    if (error.response.code === "403") {
                        navigate("/login");
                    }
                    alert(
                        `Error fetching the receiver user : ${error.response.data.message}`
                    );
                } else {
                    alert(`Error fetching the receiver user`);
                }
            }
        };

        fetchMessages();
    }, [receiverId]);

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
        <div className="flex-1 flex justify-center items-center bg-gray-100 p-3">
            <div className="max-w-[700px] w-full">
                <h2>{receiverUser ? receiverUser.name : "Name"}</h2>
                <div className="bg-gray-200 h-100 rounded-3xl overflow-y-auto p-3">
                    {messages.map((msg) => (
                        <MessageItem key={msg.id} message={msg} />
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

export default ConversationArea;
