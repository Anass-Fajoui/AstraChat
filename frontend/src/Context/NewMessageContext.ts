import { createContext } from "react";
import type { Message } from "../types/types";

type NewMessageContextProps = {
    newMessage: Message | undefined,
    setNewMessage: (msg: Message | undefined) => void
}

export const NewMessageContext = createContext<NewMessageContextProps | undefined>(undefined);