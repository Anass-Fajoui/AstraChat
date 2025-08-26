import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useContext, useEffect } from "react";
import { Outlet } from "react-router";
import Header from "../Components/Header";
import { StompClientContext } from "../Context/StompClientContext";
import UserList from "../Components/UserList";

const HomePage = () => {
    const stompContext = useContext(StompClientContext);

    if (!stompContext) {
        throw new Error("Home Page must be used inside provider");
    }
    const { setStompClient } = stompContext;

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            onConnect: () => {
                console.log("connected successfully");
                client.subscribe(
                    `/user/queue/messages`,
                    (msg) => {
                        console.log("message received : " + msg.body);
                    }
                );
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
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex items-start">
                <UserList />
                <Outlet />
            </div>
        </div>
    );
};

export default HomePage;
