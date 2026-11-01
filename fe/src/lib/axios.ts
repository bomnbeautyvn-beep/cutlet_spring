import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants/api.constants';

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Extracts CSRF token from document cookie populated by Spring Security's CookieCsrfTokenRepository
 */
function getCsrfTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const method = config.method?.toUpperCase();
    if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const token = getCsrfTokenFromCookie();
      if (token && !config.headers['X-XSRF-TOKEN']) {
        config.headers['X-XSRF-TOKEN'] = token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
      code: error.response?.data?.code || error.code,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);
