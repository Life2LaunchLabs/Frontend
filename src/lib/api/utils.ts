import { ApiError, ErrorResponse } from './types';

/**
 * Handle API error responses
 */
export async function handleApiError(response: Response): Promise<ApiError> {
  let errorData: ErrorResponse;
  
  try {
    errorData = await response.json();
  } catch {
    // Fallback if response is not JSON
    errorData = {
      message: response.statusText || 'An error occurred',
    };
  }

  return new ApiError(
    errorData.message || 'An error occurred',
    response.status,
    errorData.code,
    errorData.details
  );
}

/**
 * Delay execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.set(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Check if error is network error
 */
export function isNetworkError(error: any): boolean {
  return error instanceof TypeError && error.message === 'Failed to fetch';
}

/**
 * Format API error for user display
 */
export function formatApiError(error: any): string {
  if (error instanceof ApiError) {
    // Return user-friendly messages for common errors
    switch (error.status) {
      case 400:
        return error.message || 'Invalid request. Please check your input.';
      case 401:
        return 'Please sign in to continue.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
  
  if (isNetworkError(error)) {
    return 'Network error. Please check your connection and try again.';
  }
  
  return 'An unexpected error occurred. Please try again.';
}