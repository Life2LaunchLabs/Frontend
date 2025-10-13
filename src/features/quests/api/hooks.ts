import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { QuestService } from './QuestService';
import type { PublishedQuest, QuestEnrollment, QuestEnrollmentDetail } from '../types';

/**
 * Hook to fetch all published quests
 */
export const usePublishedQuests = (): UseQueryResult<PublishedQuest[], Error> => {
  return useQuery({
    queryKey: ['quests', 'published'],
    queryFn: QuestService.getPublishedQuests,
    staleTime: 10 * 60 * 1000, // Consider data stale after 10 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch all enrolled quests for the current user
 */
export const useEnrolledQuests = (): UseQueryResult<QuestEnrollment[], Error> => {
  return useQuery({
    queryKey: ['quests', 'enrolled'],
    queryFn: QuestService.getEnrolledQuests,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch detailed quest enrollment with all items
 */
export const useQuestEnrollmentDetail = (enrollmentId: string): UseQueryResult<QuestEnrollmentDetail, Error> => {
  return useQuery({
    queryKey: ['quests', 'enrollment', enrollmentId],
    queryFn: () => QuestService.getQuestEnrollmentDetail(enrollmentId),
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    retry: 2,
    enabled: !!enrollmentId,
  });
};
