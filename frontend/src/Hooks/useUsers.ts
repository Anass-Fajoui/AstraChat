import { useState , useEffect} from "react";
import { type User } from "../types/types";
import { fetchUsers } from "../api/api";
import { useNavigate } from "react-router";

export function useUsers(){
    const [users, setUsers] = useState<User[]>([]);
    const [userLoading, setuserLoading] = useState<boolean>(false);
    const [userError, setUserError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setuserLoading(true);
                const data = await fetchUsers();
                setUsers(data);
                setuserLoading(false);
            } catch (error: any) {
                setUserError(error.message);
                if (error.status === 403) {
                    navigate("/login");
                } else {
                    alert(`Error fetching the users : ${error.message}`);
                }
            }
        };

        loadUsers();
    }, []);

    return {users, userLoading, userError};
}

