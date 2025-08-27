import { useContext } from "react";
import { useNavigate } from "react-router";
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

    const {users, loading, error} = useUsers();

    return (
        <div className="w-[300px] h-130 bg-blue-50 p-1">
            <ul>
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text- text-red-500">{error}</p>}
                {users.map((user) =>
                    user.id === currentUser.id ? (
                        ""
                    ) : (
                        <li
                            key={user.id}
                            className={
                                user.id === selectedConv
                                    ? "m-2 p-3 bg-blue-400 hover:bg-blue-500 hover:cursor-pointer transition rounded-2xl flex justify-between items-center"
                                    : "m-2 p-3 bg-blue-200 hover:bg-blue-300 hover:cursor-pointer transition rounded-2xl flex justify-between items-center"
                            }
                            onClick={() => {
                                navigate(`${user.id}`);
                                setSelectedConv(user.id);
                            }}
                        >
                            <div>{user.name}</div>
                            {newMessage && newMessage.senderId === user.id && (
                                <div className="text-xs text-red-800">
                                    (New Messages)
                                </div>
                            )}
                        </li>
                    )
                )}
            </ul>
        </div>
    );
};

export default UserList;
