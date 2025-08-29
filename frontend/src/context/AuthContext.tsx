import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  user: { id: string };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL ;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUser({ id: decoded.user.id, email: '', name: '' });
        axios.defaults.headers.common['x-auth-token'] = token;
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log(`Login API call to ${apiUrl}/api/auth/login`);
      const res = await axios.post<{ token: string }>(`${apiUrl}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      const decoded: DecodedToken = jwtDecode(res.data.token);
      setUser({ id: decoded.user.id, email, name: '' });
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
    } catch (err: any) {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      const res = await axios.post<{ token: string }>(`${apiUrl}/api/auth/register`, { email, password, name });
      localStorage.setItem('token', res.data.token);
      const decoded: DecodedToken = jwtDecode(res.data.token);
      setUser({ id: decoded.user.id, email, name });
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
    } catch (err: any) {
      throw new Error('Registration failed');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post(`${apiUrl}/api/auth/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};