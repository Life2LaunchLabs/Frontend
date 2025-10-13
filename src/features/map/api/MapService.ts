import { apiClient } from '../../../lib/api';

export interface Activity {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  organization: {
    id: string;
    name: string;
    slug: string;
  } | null;
  meta?: Record<string, any>;
}

export interface ActivityVersion {
  id: string;
  version: number;
  title: string;
  description: string;
  meta?: Record<string, any>;
  is_published: boolean;
}

export interface ActivityWithVersion extends Activity {
  latest_version?: ActivityVersion;
}

export class MapService {
  /**
   * Get all published activities for the map
   */
  static async getMapActivities(): Promise<ActivityWithVersion[]> {
    try {
      const response = await apiClient.get<ActivityWithVersion[]>('/api/activities/activities/');

      // Filter to only published activities that have published versions
      return response.data.filter(activity =>
        activity.status === 'published' &&
        activity.latest_version?.is_published
      );
    } catch (error) {
      console.error('Failed to fetch map activities:', error);
      throw error;
    }
  }

  /**
   * Get a specific activity by ID
   */
  static async getActivity(activityId: string): Promise<ActivityWithVersion> {
    try {
      const response = await apiClient.get<ActivityWithVersion>(`/api/activities/activities/${activityId}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch activity ${activityId}:`, error);
      throw error;
    }
  }
}