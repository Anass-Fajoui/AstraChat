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
                        className={`text-xs font-semibold ${isMine ? "text-cyan-200 text-right" : "text-emerald-200"}`}
                    >
                        {isMine ? "You" : receiverName}
                    </div>
                )}
                <div
                    className={
                        "relative rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-lg" +
                        (isMine
                            ? " bg-gradient-to-br from-cyan-500 to-emerald-400 text-slate-900"
                            : " bg-white/10 text-slate-100 border border-white/5")
                    }
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
