
// api/useApi.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_URL } from './config';

export function useApi() {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  const api = axios.create({
    baseURL: `${BASE_URL}/api/`,
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      Accept: 'application/json',
    },
    withCredentials: true,
  });

  // Interceptor for token refresh
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent infinite retry loops
        try {
          const response = await axios.post<{ access: string }>(
            `${BASE_URL}/api/token/refresh/`,
            { refresh: refreshToken },
            { withCredentials: true }
          );
          const newToken = response.data.access;
          localStorage.setItem('access_token', newToken);
          api.defaults.headers['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest); // Retry the original request
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // Optionally redirect to login
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return {
    get: <T = any>(url: string, config?: AxiosRequestConfig) => api.get<T>(url, config),
    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => api.post<T>(url, data, config),
    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => api.put<T>(url, data, config),
    del: <T = any>(url: string, config?: AxiosRequestConfig) => api.delete<T>(url, config),
    raw: api, // For custom axios configurations
  };
}
