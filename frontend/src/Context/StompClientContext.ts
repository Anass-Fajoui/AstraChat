import { createContext , useContext} from "react";
import { Client } from "@stomp/stompjs";

interface StompClientContextProps{
    stompClient: Client | undefined,
    setStompClient: (client: Client | undefined) => void
}

export const StompClientContext = createContext<StompClientContextProps | undefined>(undefined);

export function useStompClientContext(){
    const stompContext = useContext(StompClientContext);
    if (!stompContext) {
        throw new Error("Home Page must be used inside stomp context provider");
    }
    return stompContext;
}