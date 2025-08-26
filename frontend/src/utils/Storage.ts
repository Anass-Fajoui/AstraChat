type StoredUser = {
    id: string,
    name: string,
    username: string,
    email: string
}

export function getStoredUser() : StoredUser {
    const userString = localStorage.getItem("user");
    if (!userString) throw new Error("user don't exist in localStorage");

    try {
        return JSON.parse(userString) as StoredUser;
    } catch (e) {
        throw new Error("Invalid user data in localStorage");
    }
}