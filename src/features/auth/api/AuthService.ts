import { apiClient } from '../../../lib/api';
import type {
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  RegisterResponse,
  User
} from '../types';

/**
 * Authentication service for user login, registration, and profile management
 */
export class AuthService {
  /**
   * Login user with username/password
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login/', credentials);
    return response.data;
  }

  /**
   * Register new user account
   */
  static async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const { confirmPassword, ...registrationData } = credentials;
    const backendData = {
      ...registrationData,
      password_confirm: confirmPassword
    };
    const response = await apiClient.post<RegisterResponse>('/api/auth/register/', backendData);
    return response.data;
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/api/auth/profile/');
    return response.data;
  }


  /**
   * Refresh authentication token
   */
  static async refreshToken(refreshToken: string): Promise<{ access: string }> {
    const response = await apiClient.post<{ access: string }>('/api/auth/token/refresh/', {
      refresh: refreshToken
    });
    return response.data;
  }

  /**
   * Update user profile
   */
  static async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await apiClient.patch<User>('/api/auth/profile/', profileData);
    return response.data;
  }

  /**
   * Logout user (blacklist tokens)
   */
  static async logout(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/api/auth/logout/');
    return response.data;
  }
}