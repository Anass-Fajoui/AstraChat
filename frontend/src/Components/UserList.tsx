import { useContext, useEffect, useState } from "react";
import { fetchUsers } from "../api/api";
import { useNavigate } from "react-router";
import { getStoredUser } from "../utils/Storage";
import { type Message, type User } from "../types/types";
import { NewMessageContext } from "../Context/NewMessageContext";

type UserListProps = {
    selectedConv: string;
    setSelectedConv: (s: string) => void;
};

const UserList = ({ selectedConv, setSelectedConv }: UserListProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const currentUser = getStoredUser();
    const navigate = useNavigate();

    const newMessageContext = useContext(NewMessageContext);
    if (!newMessageContext) {
        throw new Error("Home Page must be used inside new message provider");
    }
    const { newMessage, setNewMessage } = newMessageContext;

    useEffect(() => {
        const doTheJob = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (error: any) {
                if (error.response) {
                    if (error.status === 403) {
                        navigate("/login");
                    } else {
                        alert(`Error fetching the users : ${error.message}`);
                    }
                } else {
                    alert(`Error fetching the users`);
                }
            }
        };

        doTheJob();
    }, []);

    return (
        <div className="w-[300px] h-130 bg-blue-50 p-1">
            <ul>
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
