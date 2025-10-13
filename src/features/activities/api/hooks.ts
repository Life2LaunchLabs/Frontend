import { useQuery } from '@tanstack/react-query';
import { ActivityResultsService } from './ActivityResultsService';

export const useActivityResults = (activityId: string) => {
  return useQuery({
    queryKey: ['activity-results', activityId],
    queryFn: () => ActivityResultsService.getActivityResults(activityId),
    enabled: !!activityId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useSubmissionDetails = (submissionId: string | null) => {
  return useQuery({
    queryKey: ['submission-details', submissionId],
    queryFn: () => ActivityResultsService.getSubmissionDetails(submissionId!),
    enabled: !!submissionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useHasCompletedActivity = (activityId: string) => {
  return useQuery({
    queryKey: ['activity-completed', activityId],
    queryFn: () => ActivityResultsService.hasCompletedActivity(activityId),
    enabled: !!activityId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Legacy hooks for backward compatibility (can be removed once all components are updated)
export const useAttemptDetails = useSubmissionDetails;

// Re-export from existing activities API
export * from '../../dev/api';