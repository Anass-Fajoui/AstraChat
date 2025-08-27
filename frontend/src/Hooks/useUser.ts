import type { User } from "../types/types";
import { useState , useEffect} from "react";
import { fetchUser } from "../api/api";
import { useNavigate } from "react-router";

export function useUser(receiverId: string | undefined){
    const [user, setUser] = useState<User | undefined>(undefined);
    const [userLoading, setUserLoading] = useState<boolean>(false);
    const [userError, setUserError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            try {
                setUserLoading(true);
                const data = await fetchUser(receiverId);
                setUser(data);
                setUserLoading(false);
            } catch (error: any) {
                setUserError(error.message);
                if (error.status === 403) {
                    navigate("/login");
                } else {
                    alert(
                        `Error fetching the user : ${error.message}`
                    );
                }
            }
        }
        
        loadUser();
    }, [receiverId])

    return {user, userLoading, userError}
}