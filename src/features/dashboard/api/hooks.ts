import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { DashboardService } from './DashboardService';
import type { Milestone, Quest, DashboardData, UserProfile } from './types';

/**
 * React Query hooks for dashboard data
 */

/**
 * Hook to fetch upcoming milestones for the todo list
 */
export const useUpcomingMilestones = (): UseQueryResult<Milestone[], Error> => {
  return useQuery({
    queryKey: ['dashboard', 'upcoming-milestones'],
    queryFn: DashboardService.getUpcomingMilestones,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch user's quests
 */
export const useQuests = (): UseQueryResult<Quest[], Error> => {
  return useQuery({
    queryKey: ['dashboard', 'quests'],
    queryFn: DashboardService.getQuests,
    staleTime: 10 * 60 * 1000, // Consider data stale after 10 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch user profile for dashboard
 */
export const useUserProfile = (): UseQueryResult<UserProfile, Error> => {
  return useQuery({
    queryKey: ['dashboard', 'user-profile'],
    queryFn: DashboardService.getUserProfile,
    staleTime: 15 * 60 * 1000, // Consider data stale after 15 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch all dashboard data
 * This can be extended as more dashboard components are added
 */
export const useDashboardData = (): UseQueryResult<DashboardData, Error> => {
  return useQuery({
    queryKey: ['dashboard', 'data'],
    queryFn: DashboardService.getDashboardData,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    retry: 2,
  });
};