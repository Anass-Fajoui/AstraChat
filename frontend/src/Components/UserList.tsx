import { useEffect, useState } from "react";
import { fetchUsers } from "../api/users";
import { useNavigate } from "react-router";
import { getStoredUser } from "../utils/Storage";

type User = {
    id: string;
    name: string;
    username: string;
    email: string;
};

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const currentUser = getStoredUser();
    const navigate = useNavigate();

    useEffect(() => {
        const doTheJob = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (error: any) {
                console.log(error)
                if (error.response) {
                    if (error.response.code === "403"){
                        navigate("/login")
                    }
                    alert(
                        `Error fetching the users : ${error.response.data.message}`
                    );
                } else {
                    alert(`Error fetching the users`);
                }
            }
        };

        doTheJob();
    }, []);

    return (
        <div className="w-[300px]">
            <ul>
                {users.map((user) => ( user.id === currentUser.id ? "" :
                    <li
                        key={user.id}
                        className="p-3 bg-blue-300 hover:bg-blue-500 hover:cursor-pointer"
                        onClick={() => navigate(`/chat/${user.id}`)}
                    >
                        {user.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
