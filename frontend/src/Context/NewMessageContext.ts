import { createContext , useContext } from "react";
import type { Message } from "../types/types";

type NewMessageContextProps = {
    newMessage: Message | undefined,
    setNewMessage: (msg: Message | undefined) => void
}

export const NewMessageContext = createContext<NewMessageContextProps | undefined>(undefined);

export function useNewMessageContext(){
    const messageContext = useContext(NewMessageContext);
    if (!messageContext) {
        throw new Error("Home Page must be used inside provider");
    }
    return messageContext;
}