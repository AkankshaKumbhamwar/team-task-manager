import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
    user: { id: string } | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<{ id: string } | null>(null);

    const login = async (email: string, password: string): Promise<void> => {
        const res: any = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser({ id: 'decoded_id' }); // Decode as needed
    };

    const logout = (): void => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};