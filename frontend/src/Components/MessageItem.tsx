import { type Message } from "../types/types";
import { getStoredUser } from "../utils/Storage";


const MessageItem = ({ message, receiverName}: {message: Message, receiverName: string | undefined}) => {
    const currentUser = getStoredUser(); 
    
    return (
        <div
            className={
                currentUser.id === message.senderId
                    ? "m-2 flex justify-start"
                    : "m-2 flex justify-end"
            }
        >
            <div>
                <div
                    className={
                        currentUser.id  === message.senderId
                            ? "text-left"
                            : "text-right"
                    }
                >
                    {currentUser.id  === message.senderId ? "You" : receiverName}
                </div>
                <div className="py-2 px-4 bg-blue-500 max-w-xs lg:max-w-md rounded-3xl text-white whitespace-normal break-words">
                    {message.content}
                </div>
            </div>
        </div>
    );
    
};

export default MessageItem;
