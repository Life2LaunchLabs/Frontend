import { useQuery } from '@tanstack/react-query';
import { MapService, type ActivityWithVersion } from './MapService';

/**
 * Hook to fetch all map activities
 */
export const useMapActivities = () => {
  return useQuery<ActivityWithVersion[], Error>({
    queryKey: ['map', 'activities'],
    queryFn: MapService.getMapActivities,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch a specific activity
 */
export const useActivity = (activityId: string | null) => {
  return useQuery<ActivityWithVersion, Error>({
    queryKey: ['activities', activityId],
    queryFn: () => MapService.getActivity(activityId!),
    enabled: !!activityId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};