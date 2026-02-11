import { createContext, useState, useCallback, useMemo } from 'react';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const logout = useCallback(() => {
        localStorage.clear();
        setUser(null);
        // We use window.location because it is the most reliable way to 
        // clear the "Lanes" error during a logout crash.
        window.location.href = "/login";
    }, []);

    const value = useMemo(() => ({ user, setUser, logout }), [user, logout]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}