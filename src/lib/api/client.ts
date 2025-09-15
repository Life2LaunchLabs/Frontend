import { API_CONFIG, getBaseApiUrl } from './config';
import { ApiError, ApiResponse, RequestConfig } from './types';
import { handleApiError, delay } from './utils';

/**
 * Base API client with authentication, retry logic, and error handling
 */
export class ApiClient {
  private baseURL: string;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = getBaseApiUrl();
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { 
      method = 'GET', 
      body, 
      headers = {}, 
      timeout = API_CONFIG.TIMEOUT,
      retries = API_CONFIG.RETRY_ATTEMPTS 
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders = { ...this.getAuthHeaders(), ...headers };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw await handleApiError(response);
        }

        const data = await response.json();
        return { data, status: response.status };

      } catch (error) {
        lastError = error as Error;

        // Don't retry on authentication errors or client errors (4xx)
        if (error instanceof ApiError && error.status < 500) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === retries) {
          break;
        }

        // Exponential backoff with jitter
        const delayMs = Math.min(
          API_CONFIG.RETRY_DELAY * Math.pow(2, attempt) + Math.random() * 1000,
          API_CONFIG.MAX_RETRY_DELAY
        );
        await delay(delayMs);
      }
    }

    throw lastError || new ApiError('Request failed after retries', 500);
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PATCH', body });
  }
}

// Default API client instance
export const apiClient = new ApiClient();