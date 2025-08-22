import { type Message } from "../types/types";

interface MessageItemProps {
    message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
    const currUser = localStorage.getItem("username");

    if (message.type === "JOIN") {
        return (
            <div className="text-center text-green-500 m-2">
                {message.sender === currUser ? "You" : message.sender} Joined !
            </div>
        );
    }

    if (message.type === "LEAVE") {
        return (
            <div className="text-center text-red-500 m-2">
                {message.sender === currUser ? "You" : message.sender} Left !
            </div>
        );
    }
    if (message.type === "CHAT") {
        return (
            <div
                className={
                    currUser === message.sender
                        ? "m-2 flex justify-start"
                        : "m-2 flex justify-end"
                }
            >
                <div>
                    <div
                        className={
                            currUser === message.sender
                                ? "text-left"
                                : "text-right"
                        }
                    >
                        {message.sender === currUser ? "You" : message.sender}
                    </div>
                    <div className="py-2 px-4 bg-blue-500 max-w-xs lg:max-w-md rounded-3xl text-white whitespace-normal break-words">
                        {message.content}
                    </div>
                </div>
            </div>
        );
    }
};

export default MessageItem;
