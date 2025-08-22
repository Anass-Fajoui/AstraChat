export type Message = {
    content: string;
    sender: string;
    type: "JOIN" | "CHAT" | "LEAVE";
};