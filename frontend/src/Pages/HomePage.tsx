import { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import Header from "../Components/Header";
import UserList from "../Components/UserList";
import { useStompClient } from "../Hooks/useStompClient";

const HomePage = () => {
    const [selectedConv, setSelectedConv] = useState<string>("");
    const { stompClient } = useStompClient();
    const { receiverId } = useParams();

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
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                <Header setSelectedConv={setSelectedConv} />
                <div className="flex h-[calc(100vh-200px)] min-h-[640px] gap-4">
                    <div className="w-[320px] shrink-0">
                        <UserList
                            selectedConv={selectedConv}
                            setSelectedConv={setSelectedConv}
                        />
                    </div>
                    <div className="glass-panel flex-1 rounded-3xl overflow-hidden">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
