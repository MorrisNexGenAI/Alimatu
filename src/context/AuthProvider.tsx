// context/AuthProvider.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useApi } from '../api/useApi';
import { BASE_URL } from '../api/config';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refresh_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { raw: api } = useApi();

  // Fetch user data on mount if access token exists

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Use direct axios for login since no token is available yet
      const response = await axios.post<{ access: string; refresh: string }>(
        `${BASE_URL}/api/token/`,
        { username, password },
        { withCredentials: true }
      );
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setAccessToken(access);
      setRefreshToken(refresh);
      await fetchUser();
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error('Login Error:', JSON.stringify({
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      }, null, 2));
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setError(null);
    window.location.href = '/login';
  };
  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, loading, error, login, logout, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};