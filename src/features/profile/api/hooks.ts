import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from './ProfileService';
import { formatApiError } from '../../../lib/api/utils';
import { useToast } from '../../../shared/components';
import { useAuth } from '../../auth/api/hooks';
import type { ProfileData, ProfileUpdateData } from '../types';

// Query keys for React Query caching
export const profileQueryKeys = {
  all: ['profile'] as const,
  data: () => [...profileQueryKeys.all, 'data'] as const,
};

/**
 * Hook to get current user's profile data
 * This uses the profile-specific service but shares cache with auth profile
 */
export const useProfileData = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: profileQueryKeys.data(),
    queryFn: () => ProfileService.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: unknown) => {
      // Don't retry on authentication errors
      if ((error as any)?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook to update profile data
 */
export const useUpdateProfileData = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (profileData: ProfileUpdateData) => {
      // Use appropriate service method based on whether files are included
      if (profileData.profile_photo instanceof File) {
        return ProfileService.updateProfile(profileData);
      } else {
        // Remove profile_photo field if it's not a file
        const { profile_photo, ...basicData } = profileData;
        return ProfileService.updateBasicProfile(basicData);
      }
    },
    onSuccess: (updatedProfile: ProfileData) => {
      // Update both profile cache and auth profile cache
      queryClient.setQueryData(profileQueryKeys.data(), updatedProfile);

      // Also update the auth profile cache to keep them in sync
      queryClient.setQueryData(['auth', 'profile'], updatedProfile);

      toast.showSuccess('Profile updated!', 'Your profile has been updated successfully');
    },
    onError: (error) => {
      const errorInfo = formatApiError(error, 'profile');
      toast.showError(errorInfo.title, errorInfo.message);
    },
  });
};