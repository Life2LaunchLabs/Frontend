import { apiClient } from '../../../lib/api';
import type {
  QuestEnrollment,
  QuestEnrollmentDetail,
  PublishedQuest
} from '../types';

/**
 * Service for fetching user quest data
 */
export class QuestService {
  /**
   * Get all available (published) quest templates that user can enroll in
   */
  static async getPublishedQuests(): Promise<PublishedQuest[]> {
    const response = await apiClient.get<PublishedQuest[]>('/api/quest-templates/available/');
    return response.data;
  }

  /**
   * Get all quest enrollments for the current user
   */
  static async getEnrolledQuests(): Promise<QuestEnrollment[]> {
    const response = await apiClient.get<QuestEnrollment[]>('/api/quests/');
    return response.data;
  }

  /**
   * Get detailed quest enrollment with all items
   */
  static async getQuestEnrollmentDetail(enrollmentId: string): Promise<QuestEnrollmentDetail> {
    const response = await apiClient.get<QuestEnrollmentDetail>(`/api/quests/${enrollmentId}/`);
    return response.data;
  }
}
