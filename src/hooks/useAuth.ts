// hooks/useAuth.ts
import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api/config';
import { useApi } from '../api/useApi';


export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { raw: api } = useApi();

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
      const response = await axios.post<{ access: string; refresh: string }>(
        `${BASE_URL}/api/token/`,
        { username, password },
        { withCredentials: true }
      );
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    window.location.href = '/login';
  };
  return {loading, error, login, logout};
}
}