import { type Message } from "../types/types";
import { getStoredUser } from "../utils/Storage";

const MessageItem = ({
    message,
    receiverName,
    showName = true,
}: {
    message: Message;
    receiverName: string | undefined;
    showName?: boolean;
}) => {
    const currentUser = getStoredUser();
    const isMine = currentUser.id === message.senderId;

    return (
        <div
            className={`flex ${isMine ? "justify-end" : "justify-start"} px-1`}
        >
            <div className="max-w-[70ch] space-y-1">
                {showName && (
                    <div
                        className={`text-xs font-semibold ${
                            isMine ? "text-right" : ""
                        }`}
                        style={{
                            color: isMine ? "var(--accent)" : "var(--success)",
                        }}
                    >
                        {isMine ? "You" : receiverName}
                    </div>
                )}
                <div
                    className="relative rounded-3xl px-4 py-3 text-sm leading-relaxed transition"
                    style={{
                        backgroundColor: isMine
                            ? "var(--accent)"
                            : "var(--input-bg)",
                        color: isMine ? "#ffffff" : "var(--text-primary)",
                        border: isMine
                            ? `1px solid var(--accent)`
                            : `1px solid var(--stroke)`,
                        boxShadow: isMine
                            ? "0 4px 12px rgba(14, 165, 233, 0.2)"
                            : "0 2px 4px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <span className="block whitespace-pre-wrap break-words">
                        {message.content}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
