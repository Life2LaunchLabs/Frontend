import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

/**
 * Authentication token storage and management
 */
class AuthManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private refreshPromise: Promise<string> | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(AuthManager.ACCESS_TOKEN_KEY);
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(AuthManager.REFRESH_TOKEN_KEY);
  }

  /**
   * Store authentication tokens and set up automatic refresh
   */
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(AuthManager.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(AuthManager.REFRESH_TOKEN_KEY, refreshToken);
    apiClient.setAuthToken(accessToken);
    this.scheduleTokenRefresh(accessToken);
  }

  /**
   * Clear stored tokens and cancel refresh timer
   */
  clearTokens(): void {
    localStorage.removeItem(AuthManager.ACCESS_TOKEN_KEY);
    localStorage.removeItem(AuthManager.REFRESH_TOKEN_KEY);
    apiClient.setAuthToken(null);
    this.clearRefreshTimer();
  }

  /**
   * Decode JWT token payload
   */
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired or will expire soon
   */
  private isTokenExpired(token: string, bufferMinutes: number = 5): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }

    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const bufferTime = bufferMinutes * 60 * 1000; // Convert buffer to milliseconds
    const now = Date.now();

    return (expirationTime - bufferTime) <= now;
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  private getTimeUntilExpiration(token: string): number {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return 0;
    }

    const expirationTime = payload.exp * 1000;
    const now = Date.now();

    return Math.max(0, expirationTime - now);
  }

  /**
   * Check if user is authenticated with valid token
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    // Check if token is expired (with 1 minute buffer)
    return !this.isTokenExpired(token, 1);
  }

  /**
   * Schedule automatic token refresh before expiration
   */
  private scheduleTokenRefresh(token: string): void {
    this.clearRefreshTimer();

    const timeUntilExpiration = this.getTimeUntilExpiration(token);
    const refreshBuffer = 5 * 60 * 1000; // Refresh 5 minutes before expiration
    const refreshTime = Math.max(0, timeUntilExpiration - refreshBuffer);

    // Don't schedule if token expires very soon (less than 1 minute)
    if (refreshTime > 60 * 1000) {
      this.refreshTimer = setTimeout(async () => {
        try {
          await this.refreshAccessToken();
        } catch (error) {
          console.warn('Automatic token refresh failed:', error);
          // Let the 401 error handling take care of logout
        }
      }, refreshTime);
    }
  }

  /**
   * Clear the refresh timer
   */
  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Initialize auth manager and set token in client
   */
  initialize(): void {
    const token = this.getAccessToken();
    if (token) {
      if (this.isTokenExpired(token, 0)) {
        // Token is already expired, clear it
        this.clearTokens();
      } else {
        apiClient.setAuthToken(token);
        this.scheduleTokenRefresh(token);
      }
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string> {
    // Prevent multiple concurrent refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      // Temporarily remove auth token to avoid authentication loop
      apiClient.setAuthToken(null);

      const response = await apiClient.post<{
        access_token: string;
        refresh_token: string;
      }>(API_ENDPOINTS.AUTH.REFRESH, {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: new_refresh_token } = response.data;
      
      // Store new tokens (this will also schedule the next refresh)
      this.setTokens(access_token, new_refresh_token);

      return access_token;
    } catch (error) {
      // Clear tokens on refresh failure
      this.clearTokens();
      throw error;
    }
  }

  /**
   * Handle authentication error by attempting token refresh
   */
  async handleAuthError(): Promise<string | null> {
    try {
      return await this.refreshAccessToken();
    } catch {
      // Refresh failed, clear tokens and return null
      this.clearTokens();
      return null;
    }
  }
}

export const authManager = new AuthManager();