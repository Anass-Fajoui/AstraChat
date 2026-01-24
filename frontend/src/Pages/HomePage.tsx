import { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router";
import Header from "../Components/Header";
import UserList from "../Components/UserList";
import { useStompClient } from "../Hooks/useStompClient";

const HomePage = () => {
    const [selectedConv, setSelectedConv] = useState<string>("");
    const {stompClient} = useStompClient();
    const {receiverId} = useParams();

    useEffect(() => {
        if (receiverId) {
            setSelectedConv(receiverId);
        } else {
            setSelectedConv("");
        }

        return () => {
            if (stompClient?.connected) {
                stompClient.deactivate();
            }
        };
    }, [receiverId, stompClient]);

    return (
        <div className="min-h-screen px-4 py-6 md:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl space-y-6">
                <Header setSelectedConv={setSelectedConv} />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px,1fr]">
                    <UserList
                        selectedConv={selectedConv}
                        setSelectedConv={setSelectedConv}
                    />
                    <div className="glass-panel min-h-[640px] rounded-3xl overflow-hidden">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
