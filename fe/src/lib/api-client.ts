import { api } from './axios';
import { ApiResponse } from '@/types/api.types';
import { AxiosRequestConfig } from 'axios';

export const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const res = await api.get<ApiResponse<T>>(url, config);
    return res.data;
  },

  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const res = await api.post<ApiResponse<T>>(url, data, config);
    return res.data;
  },

  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const res = await api.put<ApiResponse<T>>(url, data, config);
    return res.data;
  },

  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const res = await api.patch<ApiResponse<T>>(url, data, config);
    return res.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const res = await api.delete<ApiResponse<T>>(url, config);
    return res.data;
  },
};
