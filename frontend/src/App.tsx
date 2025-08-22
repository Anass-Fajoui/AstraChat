import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import ChatPage from "./Pages/ChatPage";
import { useState } from "react";
import ProtectedRoute from "./Components/ProtectedRoute";
import { StompClientContext } from "./Context/StompClientContext";
import { Client } from "@stomp/stompjs";

function App() {
    const [stompClient, setStompClient] = useState<Client | undefined>(undefined);
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <StompClientContext.Provider value={{stompClient, setStompClient}}>
                            <ChatPage />
                        </StompClientContext.Provider>
                    </ProtectedRoute>
                }
            />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    );
}

export default App;
