import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

/**
 * Authentication token storage and management
 */
class AuthManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private refreshPromise: Promise<string> | null = null;

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
   * Store authentication tokens
   */
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(AuthManager.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(AuthManager.REFRESH_TOKEN_KEY, refreshToken);
    apiClient.setAuthToken(accessToken);
  }

  /**
   * Clear stored tokens
   */
  clearTokens(): void {
    localStorage.removeItem(AuthManager.ACCESS_TOKEN_KEY);
    localStorage.removeItem(AuthManager.REFRESH_TOKEN_KEY);
    apiClient.setAuthToken(null);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Initialize auth manager and set token in client
   */
  initialize(): void {
    const token = this.getAccessToken();
    if (token) {
      apiClient.setAuthToken(token);
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
      
      // Store new tokens
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