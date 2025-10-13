import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { DashboardService } from './DashboardService';
import type { QuestItem, QuestEnrollment, DashboardData, UserProfile } from './types';

/**
 * React Query hooks for dashboard data (unified quest system)
 */

/**
 * Hook to fetch upcoming quest items for the todo list
 */
export const useUpcomingQuestItems = (): UseQueryResult<QuestItem[], Error> => {
  return useQuery({
    queryKey: ['dashboard', 'upcoming-quest-items'],
    queryFn: DashboardService.getUpcomingQuestItems,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch user's active quest enrollments
 */
export const useActiveQuests = (): UseQueryResult<QuestEnrollment[], Error> => {
  return useQuery({
    queryKey: ['dashboard', 'active-quests'],
    queryFn: DashboardService.getActiveQuests,
    staleTime: 10 * 60 * 1000, // Consider data stale after 10 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch all user's quest enrollments
 */
export const useAllQuests = (): UseQueryResult<QuestEnrollment[], Error> => {
  return useQuery({
    queryKey: ['dashboard', 'all-quests'],
    queryFn: DashboardService.getAllQuests,
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