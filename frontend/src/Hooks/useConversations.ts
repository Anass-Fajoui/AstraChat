import { useState, useEffect, useCallback } from "react";
import { type Conversation } from "../types/types";
import { fetchConversations } from "../api/api";
import { useNavigate } from "react-router";
import { getStoredUser } from "../utils/Storage";

export function useConversations() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const storedUser = getStoredUser();

    const loadConversations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchConversations(storedUser.id);
            setConversations(data);
        } catch (err: any) {
            setError(err.message);
            if (err.status === 403) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    }, [storedUser.id, navigate]);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    // Function to refresh conversations (e.g., after sending a message)
    const refreshConversations = useCallback(() => {
        loadConversations();
    }, [loadConversations]);

    return { conversations, loading, error, refreshConversations, setConversations };
}
