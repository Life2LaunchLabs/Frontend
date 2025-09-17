import { apiClient } from '../../../lib/api';
import type {
  DashboardData,
  Milestone,
  Quest,
  UserProfile
} from './types';

/**
 * Dashboard service for fetching dashboard-specific data
 */
export class DashboardService {
  /**
   * Get upcoming milestones for the dashboard todo list using V2 bridge API
   * Returns the 5 earliest non-completed milestones
   */
  static async getUpcomingMilestones(): Promise<Milestone[]> {
    const response = await apiClient.get<Milestone[]>('/api/v2/milestones/upcoming/');
    return response.data;
  }

  /**
   * Get user's quests for dashboard overview using V2 bridge API
   */
  static async getQuests(): Promise<Quest[]> {
    const response = await apiClient.get<Quest[]>('/api/v2/quests/');
    return response.data;
  }

  /**
   * Get user profile data for dashboard
   */
  static async getUserProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/api/auth/profile/');
    return response.data;
  }

  /**
   * Get all dashboard data in a single request (future extensibility)
   * This can be extended to include other dashboard components' data
   */
  static async getDashboardData(): Promise<DashboardData> {
    // For now, we'll make separate calls but this can be optimized later
    // with a dedicated dashboard endpoint that returns everything at once
    const [upcomingMilestones] = await Promise.all([
      this.getUpcomingMilestones(),
    ]);

    return {
      upcoming_milestones: upcomingMilestones,
    };
  }
}