import type { Message } from "../types/types";
import { useState , useEffect} from "react";
import { fetchConversationMessages } from "../api/api";
import { useNavigate } from "react-router";

export function useMessages(receiverId: string | undefined, newMessage: Message | undefined){
    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
    const [messagesError, setMessagesError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadMessages = async () => {
            try {
                setMessagesLoading(true);
                const data = await fetchConversationMessages(receiverId);
                setMessages(data);
                setMessagesLoading(false);
            } catch (error: any) {
                setMessagesError(error.message);
                if (error.status === 403) {
                    navigate("/login");
                } else {
                    alert(
                        `Error fetching the messages : ${error.message}`
                    );
                }
            }
        }

        loadMessages();
    }, [receiverId, newMessage])

    return {messages, setMessages, messagesLoading, messagesError}
}