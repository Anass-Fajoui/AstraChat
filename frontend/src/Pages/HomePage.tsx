import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router";
import Header from "../Components/Header";
import { useStompClientContext } from "../Context/StompClientContext";
import UserList from "../Components/UserList";
import { useNewMessageContext } from "../Context/NewMessageContext";

const HomePage = () => {
    const [selectedConv, setSelectedConv] = useState<string>("");
    const { setStompClient } = useStompClientContext();
    const { newMessage, setNewMessage } = useNewMessageContext();
    const {receiverId} = useParams();

    useEffect(() => {
        if (receiverId) {
            setSelectedConv(receiverId);
        } else {
            setSelectedConv("");
        }
        const socket = new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            onConnect: () => {
                console.log("connected successfully");
                client.subscribe(`/user/queue/messages`, (msg) => {
                    console.log("message received : " + msg.body);
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
        return () => {
            if (client.connected) {
                client.deactivate();
            }
        };
    }, []);

    return (
        <div className="h-screen flex flex-col">
            <Header setSelectedConv={setSelectedConv} />
            <div className="flex items-start">
                <UserList
                    selectedConv={selectedConv}
                    setSelectedConv={setSelectedConv}
                />
                <Outlet />
            </div>
        </div>
    );
};

export default HomePage;
