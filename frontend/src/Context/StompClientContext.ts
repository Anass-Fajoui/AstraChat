import { createContext } from "react";
import { Client } from "@stomp/stompjs";

interface StompClientContextProps{
    stompClient: Client | undefined,
    setStompClient: (client: Client | undefined) => void
}

export const StompClientContext = createContext<StompClientContextProps | undefined>(undefined);