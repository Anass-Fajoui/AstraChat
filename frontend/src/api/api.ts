import axios from "axios"
import { getStoredUser } from "../utils/Storage"
import type { RegisterFormValue, LoginFormValue, User } from "../types/types";


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
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
    });
    
    return response.data;
}

export async function fetchUser(id : String): Promise<User>{
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
    });

    return response.data;
}

export async function fetchConversationMessages(receiverId: string){
    const storedUser = getStoredUser();
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/message/${storedUser.id}/${receiverId}`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
    });

    return response.data; 
}
