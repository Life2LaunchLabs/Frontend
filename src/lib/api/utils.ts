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
export function formatApiError(error: any): { title: string; message: string; type: 'error' | 'warning' } {
  if (error instanceof ApiError) {
    // Return user-friendly messages for common errors
    switch (error.status) {
      case 400:
        return {
          title: 'Invalid Request',
          message: error.message || 'Please check your input and try again.',
          type: 'error'
        };
      case 401:
        return {
          title: 'Authentication Required',
          message: 'Please sign in to continue.',
          type: 'warning'
        };
      case 403:
        return {
          title: 'Access Denied',
          message: 'You do not have permission to perform this action.',
          type: 'error'
        };
      case 404:
        return {
          title: 'Not Found',
          message: 'The requested resource could not be found.',
          type: 'error'
        };
      case 429:
        return {
          title: 'Rate Limited',
          message: 'Too many requests. Please wait a moment and try again.',
          type: 'warning'
        };
      case 500:
      case 502:
      case 503:
        return {
          title: 'System Issues',
          message: 'We\'re experiencing technical difficulties. Please try again in a few moments.',
          type: 'error'
        };
      default:
        return {
          title: 'Something Went Wrong',
          message: error.message || 'An unexpected error occurred.',
          type: 'error'
        };
    }
  }
  
  if (isNetworkError(error)) {
    return {
      title: 'Connection Problem',
      message: 'Unable to connect to our servers. Please check your internet connection and try again.',
      type: 'error'
    };
  }
  
  return {
    title: 'Unexpected Error',
    message: 'Something went wrong. Please try again.',
    type: 'error'
  };
}