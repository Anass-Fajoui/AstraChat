import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { Message } from "../types/types";
import { useEffect } from "react";
import { useStompClientContext } from "../Context/StompClientContext";
import { useNewMessageContext } from "../Context/NewMessageContext";


export function useStompClient(){
    const { stompClient, setStompClient } = useStompClientContext();
    const { newMessage, setNewMessage } = useNewMessageContext();

    useEffect(() => {
        const socket = new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            onConnect: () => {
                client.subscribe(`/user/queue/messages`, (msg) => {
                    const m = JSON.parse(msg.body);
                    setNewMessage({
                        id: "",
                        chatId: "",
                        senderId: m.senderId,
                        receiverId: m.receiverId,
                        content: m.content,
                    });
                });
            },
            onDisconnect: () => {},
        });

        client.activate();
        setStompClient(client);
    }, [])
    
    return {stompClient, setStompClient}
}