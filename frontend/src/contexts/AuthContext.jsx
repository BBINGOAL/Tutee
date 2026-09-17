import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    // ตอนเปิดเว็บ ให้ดึง Token จาก localStorage มาเช็คว่าเคยล็อกอินไว้ไหม
    useEffect(() => {
        const storedToken = localStorage.getItem('tutee_token');
        const storedUser = localStorage.getItem('tutee_user');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('tutee_token', newToken);
        localStorage.setItem('tutee_user', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('tutee_token');
        localStorage.removeItem('tutee_user');
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
