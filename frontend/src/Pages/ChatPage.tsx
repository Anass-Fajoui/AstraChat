import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { type Message } from "../types/types";
import Header from "../Components/Header";
import ChatArea from "../Components/ChatArea";
import { StompClientContext } from "../Context/StompClientContext";

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [connected, setConnected] = useState<boolean>(false);
    const stompContext = useContext(StompClientContext)
    if (!stompContext){
        throw new Error("ChatPage must be used inside provider")
    }
    const {stompClient, setStompClient} = stompContext;

    const username = localStorage.getItem("username");
    const navigate = useNavigate();

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                setConnected(true);
                client.subscribe("/topic/public", (msg) => {
                    setMessages((prev) => [...prev, JSON.parse(msg.body)]);
                });

                client.publish({
                    destination: "/app/chat.addUser",
                    body: JSON.stringify({
                        sender: username,
                        content: "Hello World",
                        type: "JOIN",
                    }),
                });
            },
            onDisconnect: () => {
                setConnected(false);
            },
        });

        client.activate();
        setStompClient(client);
        return () => {
            if (client.connected) {
                client.deactivate();
            }
        };
    }, []);

    function disconnect() {
        stompClient?.deactivate();
        setConnected(false);
        localStorage.setItem("username", "");
        navigate("/login");
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header connected={connected} disconnect={disconnect}/>
            <ChatArea messages={messages}/>
        </div>
    );
};

export default ChatPage;
