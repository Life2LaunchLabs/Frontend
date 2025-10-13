import { apiClient } from '../../../lib/api';
import type {
  DashboardData,
  QuestItem,
  QuestEnrollment,
  UserProfile
} from './types';

/**
 * Dashboard service for fetching dashboard-specific data (unified quest system)
 */
export class DashboardService {
  /**
   * Get upcoming quest items for the dashboard todo list
   * Returns the next 5 non-completed items from active quests
   */
  static async getUpcomingQuestItems(): Promise<QuestItem[]> {
    const response = await apiClient.get<QuestItem[]>('/api/quest-items/upcoming/');
    return response.data;
  }

  /**
   * Get user's active quest enrollments
   */
  static async getActiveQuests(): Promise<QuestEnrollment[]> {
    const response = await apiClient.get<QuestEnrollment[]>('/api/quests/active/');
    return response.data;
  }

  /**
   * Get all user's quest enrollments
   */
  static async getAllQuests(): Promise<QuestEnrollment[]> {
    const response = await apiClient.get<QuestEnrollment[]>('/api/quests/');
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
   * Get all dashboard data
   */
  static async getDashboardData(): Promise<DashboardData> {
    const [upcomingItems, activeQuests] = await Promise.all([
      this.getUpcomingQuestItems(),
      this.getActiveQuests(),
    ]);

    return {
      upcoming_items: upcomingItems,
      active_quests: activeQuests,
    };
  }
}