import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useState, useContext, useEffect } from "react";
import { Outlet, useParams } from "react-router";
import Header from "../Components/Header";
import { StompClientContext } from "../Context/StompClientContext";
import UserList from "../Components/UserList";
import { NewMessageContext } from "../Context/NewMessageContext";

const HomePage = () => {
    const [selectedConv, setSelectedConv] = useState<string>("");

    const stompContext = useContext(StompClientContext);
    if (!stompContext) {
        throw new Error("Home Page must be used inside stomp context provider");
    }
    const { setStompClient } = stompContext;

    const newMessageContext = useContext(NewMessageContext);
    if (!newMessageContext) {
        throw new Error("Home Page must be used inside new message provider");
    }
    const { newMessage, setNewMessage } = newMessageContext;
    const {receiverId} = useParams();
    
    useEffect(() => {
        if (receiverId) {
            setSelectedConv(receiverId);
        } else {
            setSelectedConv("");
        }
        const socket = new SockJS("http://localhost:8080/ws");
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
