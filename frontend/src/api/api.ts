import axios from "axios"
import { getStoredUser } from "../utils/Storage"
import type { RegisterFormValue, LoginFormValue, User, Conversation } from "../types/types";

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
});

export async function Register(data: RegisterFormValue){
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, data);
    return response.data;
}

export async function Login(data: LoginFormValue){
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, data);
    return response.data;
}

export async function fetchUsers() : Promise<User[]>{
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        headers: getAuthHeaders()
    });
    
    return response.data;
}

export async function fetchUser(id : string | undefined): Promise<User>{
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`, {
        headers: getAuthHeaders()
    });

    return response.data;
}

export async function fetchConversationMessages(receiverId: string | undefined){
    const storedUser = getStoredUser();
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/message/${storedUser.id}/${receiverId}`, {
        headers: getAuthHeaders()
    });

    return response.data; 
}

/**
 * Search users by username or name
 */
export async function searchUsers(query: string, currentUserId: string): Promise<User[]> {
    if (!query.trim()) {
        return [];
    }
    
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/search`, {
        params: { query, currentUserId },
        headers: getAuthHeaders()
    });
    
    return response.data;
}

/**
 * Get conversations for a user (users they have chatted with before)
 */
export async function fetchConversations(userId: string): Promise<Conversation[]> {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}/conversations`, {
        headers: getAuthHeaders()
    });
    
    return response.data;
}
