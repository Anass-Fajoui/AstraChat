import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../utils/Storage";
import { NewMessageContext } from "../Context/NewMessageContext";
import { useUsers } from "../Hooks/useUsers";

type UserListProps = {
    selectedConv: string;
    setSelectedConv: (s: string) => void;
};

const UserList = ({ selectedConv, setSelectedConv }: UserListProps) => {
    const currentUser = getStoredUser();
    const navigate = useNavigate();

    const newMessageContext = useContext(NewMessageContext);
    if (!newMessageContext) {
        throw new Error("Home Page must be used inside new message provider");
    }
    const { newMessage, setNewMessage } = newMessageContext;

    const { users, loading, error } = useUsers();

    return (
        <aside className="glass-panel flex h-full flex-col rounded-3xl p-4 text-slate-100">
            <div className="flex items-center justify-between pb-2">
                <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Inbox
                    </p>
                    <h3 className="text-xl font-semibold">Conversations</h3>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 border border-white/10">
                    {users.length - 1} active
                </span>
            </div>
            <div className="mt-2 flex-1 space-y-2 overflow-y-auto pr-1">
                {loading && (
                    <p className="text-sm text-slate-300">Loading people...</p>
                )}
                {error && <p className="text-sm text-amber-300">{error}</p>}
                {users.map((user) =>
                    user.id === currentUser.id ? null : (
                        <button
                            key={user.id}
                            className={
                                user.id === selectedConv
                                    ? "w-full rounded-2xl border border-cyan-300/50 bg-cyan-500/20 px-4 py-3 text-left shadow-lg shadow-cyan-500/15 transition hover:-translate-y-[1px]"
                                    : "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:-translate-y-[1px] hover:border-cyan-300/40 hover:bg-cyan-500/10"
                            }
                            onClick={() => {
                                navigate(`${user.id}`);
                                setSelectedConv(user.id);
                                if (
                                    newMessage &&
                                    newMessage.senderId === user.id
                                ) {
                                    setNewMessage(undefined);
                                }
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-white">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-slate-300">
                                        @{user.username}
                                    </p>
                                </div>
                                {newMessage &&
                                newMessage.senderId === user.id ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 text-amber-900 px-3 py-1 text-xs font-semibold">
                                        New
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    </span>
                                ) : (
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                )}
                            </div>
                        </button>
                    ),
                )}
                {!loading &&
                    users.filter((user) => user.id !== currentUser.id)
                        .length === 0 && (
                        <p className="text-sm text-slate-300">
                            No other users yet.
                        </p>
                    )}
            </div>
        </aside>
    );
};

export default UserList;
