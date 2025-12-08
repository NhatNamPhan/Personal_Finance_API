import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user_id');
        if (storedUser) {
            setUser({ id: storedUser });
        }
        setLoading(false);
    }, []);

    const login = (userId) => {
        localStorage.setItem('user_id', userId);
        setUser({ id: userId });
    };

    const logout = () => {
        localStorage.removeItem('user_id');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
