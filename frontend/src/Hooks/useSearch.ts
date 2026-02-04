import { useState, useCallback } from "react";
import { type User } from "../types/types";
import { searchUsers } from "../api/api";
import { getStoredUser } from "../utils/Storage";

export function useSearch() {
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [searching, setSearching] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const storedUser = getStoredUser();

    const search = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setSearching(true);
            setSearchError(null);
            const results = await searchUsers(query, storedUser.id);
            setSearchResults(results);
        } catch (err: any) {
            setSearchError(err.message);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    }, [storedUser.id]);

    const clearSearch = useCallback(() => {
        setSearchResults([]);
        setSearchError(null);
    }, []);

    return { searchResults, searching, searchError, search, clearSearch };
}
