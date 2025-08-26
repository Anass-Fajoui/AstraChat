import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import { useState } from "react";
import ProtectedRoute from "./Components/ProtectedRoute";
import { StompClientContext } from "./Context/StompClientContext";
import { Client } from "@stomp/stompjs";
import SignUpPage from "./Pages/SignUpPage";
import ConversationArea from "./Components/ConversationArea";
import EmptyConversation from "./Components/EmptyConversation";

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
                            <HomePage />
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
