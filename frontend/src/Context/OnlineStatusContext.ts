import { createContext, useContext } from "react";

export type OnlineStatus = {
    userId: string;
    isOnline: boolean;
    lastSeen: string;
};

export type OnlineStatusContextType = {
    onlineStatuses: Map<string, OnlineStatus>;
    setOnlineStatuses: React.Dispatch<React.SetStateAction<Map<string, OnlineStatus>>>;
};

export const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

export function useOnlineStatusContext() {
    const context = useContext(OnlineStatusContext);
    if (!context) {
        throw new Error("useOnlineStatusContext must be used inside OnlineStatusProvider");
    }
    return context;
}
