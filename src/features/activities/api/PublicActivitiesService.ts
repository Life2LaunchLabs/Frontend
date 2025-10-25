import { apiClient } from '../../../lib/api';
import { Activity, Attempt, Response } from '../types';

/**
 * Service for public (unauthenticated) activity access.
 * Used for onboarding activities before users create an account.
 */
export class PublicActivitiesService {
  private static baseURL = '/api/public';

  /**
   * Get a public activity by slug (e.g., 'welcome')
   */
  static async getPublicActivity(slug: string): Promise<Activity> {
    const response = await apiClient.get<Activity>(`${this.baseURL}/activities/${slug}/`);
    return response.data;
  }

  /**
   * Get a page from a public activity
   */
  static async getPublicActivityPage(slug: string, pageIndex: number): Promise<any> {
    const activity = await this.getPublicActivity(slug);

    if (!activity.activity_version) {
      throw new Error('No published version found for this activity');
    }

    const pages = activity.activity_version.pages || [];
    const page = pages.find(p => p.index === pageIndex);

    if (!page) {
      throw new Error(`Page ${pageIndex} not found`);
    }

    const media = activity.media || [];
    return {
      page: page,
      blocks: page.blocks || [],
      media: media,
      activity_version: activity.activity_version
    };
  }

  /**
   * Create a guest attempt (stored in session)
   */
  static async createGuestAttempt(activityVersionId: string): Promise<Attempt> {
    const response = await apiClient.post<Attempt>(`${this.baseURL}/attempts/`, {
      activity_version_id: activityVersionId,
      meta: { started_from: 'public_onboarding' }
    });
    return response.data;
  }

  /**
   * Submit a response for a guest attempt
   */
  static async submitGuestResponse(
    attemptId: string,
    questionId: string,
    questionType: string,
    pageId: string,
    value: any,
    valid: boolean = true
  ): Promise<Response> {
    const response = await apiClient.post<Response>(
      `${this.baseURL}/attempts/${attemptId}/submit_response/`,
      {
        question_id: questionId,
        question_type: questionType,
        page_id: pageId,
        value: value,
        valid: valid,
        meta: { submitted_at: new Date().toISOString() }
      }
    );
    return response.data;
  }

  /**
   * Update page progress for a guest attempt
   */
  static async updateGuestPageProgress(
    attemptId: string,
    pageId: string,
    reached: boolean = true,
    data: any = {}
  ): Promise<any> {
    const response = await apiClient.post<any>(
      `${this.baseURL}/attempts/${attemptId}/update_progress/`,
      {
        page_id: pageId,
        reached: reached,
        data: data
      }
    );
    return response.data;
  }

  /**
   * Complete a guest attempt
   */
  static async completeGuestAttempt(attemptId: string): Promise<Attempt> {
    const response = await apiClient.post<Attempt>(
      `${this.baseURL}/attempts/${attemptId}/complete/`
    );
    return response.data;
  }
}
