import { apiClient } from '../../../lib/api';
import type { ProfileData, ProfileUpdateData } from '../types';

/**
 * Profile service - wrapper around auth endpoints for profile management
 */
export class ProfileService {
  /**
   * Get current user's full profile data
   */
  static async getProfile(): Promise<ProfileData> {
    const response = await apiClient.get<ProfileData>('/api/auth/profile/');
    return response.data;
  }

  /**
   * Update user profile
   */
  static async updateProfile(profileData: ProfileUpdateData): Promise<ProfileData> {
    // Check if we have a file upload
    const hasFile = profileData.profile_photo instanceof File;

    if (hasFile) {
      // Create FormData for file uploads
      const formData = new FormData();

      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'profile_photo' && value instanceof File) {
            formData.append(key, value);
          } else if (typeof value === 'string') {
            formData.append(key, value);
          }
        }
      });

      // Don't set Content-Type header - let browser set it with boundary
      const response = await apiClient.patch<ProfileData>('/api/auth/profile/', formData);
      return response.data;
    } else {
      // Use JSON for non-file updates
      const { profile_photo, ...jsonData } = profileData;
      const response = await apiClient.patch<ProfileData>('/api/auth/profile/', jsonData);
      return response.data;
    }
  }

  /**
   * Update basic profile info (non-file fields only)
   */
  static async updateBasicProfile(profileData: Omit<ProfileUpdateData, 'profile_photo'>): Promise<ProfileData> {
    const response = await apiClient.patch<ProfileData>('/api/auth/profile/', profileData);
    return response.data;
  }
}