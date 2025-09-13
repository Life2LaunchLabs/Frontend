// API Configuration
// Environment-specific URL formatting based on ConnectionStatus pattern

/**
 * Format API URL to ensure it has proper scheme
 * @param url - Base URL without protocol
 * @returns Fully formatted URL with appropriate scheme
 */
export const formatApiUrl = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      return `http://${url}`;
    } else {
      return `https://${url}`;
    }
  }
  return url;
};

/**
 * Get the base API URL for the current environment
 */
export const getBaseApiUrl = (): string => {
  // In development mode, explicitly point to backend on port 8001
  if (import.meta.env.DEV) {
    return 'http://localhost:8001';
  }
  
  // In production, use the configured API URL
  const apiUrl = import.meta.env.VITE_API_URL || 'localhost:8000';
  return formatApiUrl(apiUrl);
};

/**
 * API endpoint configuration
 */
export const API_ENDPOINTS = {
  // Health & Status
  HEALTH: '/api/health/',
  
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login/',
    LOGOUT: '/api/auth/logout/',
    REFRESH: '/api/auth/refresh/',
    REGISTER: '/api/auth/register/',
  },
  
  // Chat
  CHAT: {
    SEND: '/api/chat/send/',
    HISTORY: '/api/chat/history/',
    SESSIONS: '/api/chat/sessions/',
  },
  
  // Profile
  PROFILE: {
    GET: '/api/profile/',
    UPDATE: '/api/profile/',
  },
} as const;

/**
 * API configuration constants
 */
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second base delay
  MAX_RETRY_DELAY: 10000, // 10 seconds max delay
} as const;