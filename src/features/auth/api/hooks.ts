import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService } from './AuthService';
import { authManager } from '../../../lib/api/auth';
import { formatApiError } from '../../../lib/api/utils';
import { useToast } from '../../../shared/components';
import type {
  LoginCredentials,
  RegisterCredentials
} from '../types';

// Query keys for React Query caching
export const authQueryKeys = {
  all: ['auth'] as const,
  user: () => [...authQueryKeys.all, 'user'] as const,
  profile: () => [...authQueryKeys.all, 'profile'] as const,
};

/**
 * Hook to get authentication state
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth manager and check authentication status
    authManager.initialize();
    setIsAuthenticated(authManager.isAuthenticated());
    setIsInitialized(true);
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    authManager.setTokens(accessToken, refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authManager.clearTokens();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isInitialized,
    login,
    logout
  };
};

/**
 * Hook to login user
 */
export const useLogin = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await AuthService.login(credentials);
      return result;
    },
    onSuccess: (data) => {
      login(data.tokens.access, data.tokens.refresh);
      
      // Cache user data
      queryClient.setQueryData(authQueryKeys.profile(), data.user);
      
      toast.showSuccess('Welcome back!', `Logged in as ${data.user.username}`);
    },
    onError: (error) => {
      const errorInfo = formatApiError(error, 'auth');
      toast.showError(errorInfo.title, errorInfo.message);
    },
  });
};

/**
 * Hook to register new user
 */
export const useRegister = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const result = await AuthService.register(credentials);
      return result;
    },
    onSuccess: (data) => {
      login(data.tokens.access, data.tokens.refresh);
      
      // Cache user data
      queryClient.setQueryData(authQueryKeys.profile(), data.user);
      
      toast.showSuccess('Account created!', `Welcome ${data.user.username}!`);
    },
    onError: (error) => {
      const errorInfo = formatApiError(error, 'auth');
      toast.showError(errorInfo.title, errorInfo.message);
    },
  });
};

/**
 * Hook to logout user
 */
export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async () => {
      try {
        await AuthService.logout();
      } catch (error) {
        // Continue with logout even if API call fails
        console.warn('Logout API call failed, proceeding with local logout:', error);
      }
    },
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all cached data
      toast.showSuccess('Goodbye!', 'You have been logged out successfully');
    },
    onError: () => {
      // Still logout locally even if API fails
      logout();
      queryClient.clear();

      // const errorInfo = formatApiError(error);
      toast.showWarning('Logged out locally', 'Server logout failed but you have been logged out locally');
    },
  });
};

/**
 * Hook to get current user profile
 */
export const useProfile = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: authQueryKeys.profile(),
    queryFn: () => AuthService.getProfile(),
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
 * Hook to check username availability
 */
export const useCheckUsername = () => {
  return useMutation({
    mutationFn: (username: string) => AuthService.checkUsername(username),
  });
};