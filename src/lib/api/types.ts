/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
}

/**
 * Request configuration options
 */
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: HeadersInit;
  timeout?: number;
  retries?: number;
}

/**
 * Standardized API error
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /**
   * Check if error is a specific HTTP status
   */
  is(status: number): boolean {
    return this.status === status;
  }

  /**
   * Check if error is client error (4xx)
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Check if error is server error (5xx)
   */
  isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * Check if error is authentication related
   */
  isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }
}

/**
 * Standard error response from backend
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
  timestamp?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}