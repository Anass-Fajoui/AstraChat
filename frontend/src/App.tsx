import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import { useState } from "react";
import ProtectedRoute from "./Components/ProtectedRoute";
import { StompClientContext } from "./Context/StompClientContext";
import { NewMessageContext } from "./Context/NewMessageContext";
import { Client } from "@stomp/stompjs";
import SignUpPage from "./Pages/SignUpPage";
import ConversationArea from "./Components/ConversationArea";
import EmptyConversation from "./Components/EmptyConversation";
import type { Message } from "./types/types";

function App() {
    const [stompClient, setStompClient] = useState<Client | undefined>(
        undefined
    );
    const [newMessage, setNewMessage] = useState<Message | undefined>(
        undefined
    );

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <StompClientContext.Provider
                            value={{ stompClient, setStompClient }}
                        >
                            <NewMessageContext.Provider
                                value={{ newMessage, setNewMessage }}
                            >
                                <HomePage />
                            </NewMessageContext.Provider>
                        </StompClientContext.Provider>
                    </ProtectedRoute>
                }
            >
                <Route path="" element={<EmptyConversation />} />
                <Route path=":receiverId" element={<ConversationArea />} />
            </Route>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    );
}

export default App;
