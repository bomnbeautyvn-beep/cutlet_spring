export interface ApiResponse<T = unknown> {
  code?: number;
  status?: number;
  message?: string;
  data: T;
  success?: boolean;
  timestamp?: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  errors?: Record<string, string[]>;
}
