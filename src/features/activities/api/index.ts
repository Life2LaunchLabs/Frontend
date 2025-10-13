import { apiClient } from '../../../lib/api';
import { Activity, Attempt, Response, PageProgress } from '../types';

export class ActivitiesService {
  private static adminURL = '/api/admin';
  private static userURL = '/api';

  static async getActivities(): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>(`${this.adminURL}/activities/`);
    return response.data;
  }

  static async getActivity(id: string): Promise<Activity> {
    const response = await apiClient.get<Activity>(`${this.userURL}/activities/${id}/`);
    return response.data;
  }

  static async getActivityPage(activityId: string, pageIndex: number): Promise<any> {
    // Fetch the full activity with nested pages and blocks
    const activity = await this.getActivity(activityId);

    if (!activity.activity_version) {
      throw new Error('No published version found for this activity');
    }

    const pages = activity.activity_version.pages || [];

    // Find the page at the requested index
    const page = pages.find(p => p.index === pageIndex);

    if (!page) {
      throw new Error(`Page ${pageIndex} not found`);
    }

    // Return in ActivityPageResponse format
    const media = activity.media || [];
    return {
      page: page,
      blocks: page.blocks || [],
      media: media,
      activity_version: activity.activity_version
    };
  }

  static async createDemoActivity(): Promise<Activity> {
    const response = await apiClient.post<{ activity: Activity }>(`${this.adminURL}/demo/create/`);
    return response.data.activity;
  }

  static async healthCheck(): Promise<{ status: string; service: string; timestamp: string }> {
    const response = await apiClient.get<{ status: string; service: string; timestamp: string }>(`${this.adminURL}/health/`);
    return response.data;
  }

  // Attempt Management - User-facing endpoints
  static async createAttempt(activityVersionId: string, questInstanceId?: string): Promise<Attempt> {
    const response = await apiClient.post<Attempt>(`${this.userURL}/attempts/`, {
      activity_version_id: activityVersionId,
      quest_instance_id: questInstanceId,
      meta: { started_from: 'activity_session' }
    });
    return response.data;
  }

  static async getAttempt(attemptId: string): Promise<Attempt> {
    const response = await apiClient.get<Attempt>(`${this.userURL}/attempts/${attemptId}/`);
    return response.data;
  }

  static async getUserAttempts(): Promise<Attempt[]> {
    const response = await apiClient.get<Attempt[]>(`${this.userURL}/attempts/`);
    return response.data;
  }

  static async completeAttempt(attemptId: string): Promise<Attempt> {
    const response = await apiClient.post<Attempt>(`${this.userURL}/attempts/${attemptId}/complete/`);
    return response.data;
  }

  static async abandonAttempt(attemptId: string): Promise<Attempt> {
    const response = await apiClient.post<Attempt>(`${this.userURL}/attempts/${attemptId}/abandon/`);
    return response.data;
  }

  // Response Management
  static async submitResponse(attemptId: string, questionId: string, questionType: string, pageId: string, value: any, valid: boolean = true): Promise<Response> {
    const response = await apiClient.post<Response>(`${this.userURL}/attempts/${attemptId}/submit_response/`, {
      question_id: questionId,
      question_type: questionType,
      page_id: pageId,
      value: value,
      valid: valid,
      meta: { submitted_at: new Date().toISOString() }
    });
    return response.data;
  }

  static async submitMultipleResponses(attemptId: string, responses: Array<{
    question_id: string;
    question_type: string;
    page_id: string;
    value: any;
    valid?: boolean;
  }>): Promise<Response[]> {
    const response = await apiClient.post<Response[]>(`${this.userURL}/attempts/${attemptId}/submit_responses/`, {
      responses: responses.map(r => ({ ...r, valid: r.valid ?? true }))
    });
    return response.data;
  }

  static async getAttemptResponses(attemptId: string): Promise<Response[]> {
    const response = await apiClient.get<Response[]>(`${this.userURL}/attempts/${attemptId}/responses/`);
    return response.data;
  }

  // Progress Management
  static async updatePageProgress(attemptId: string, pageId: string, reached: boolean = true, data: any = {}): Promise<PageProgress> {
    const response = await apiClient.post<PageProgress>(`${this.userURL}/attempts/${attemptId}/update_progress/`, {
      page_id: pageId,
      reached: reached,
      data: data
    });
    return response.data;
  }

  static async getAttemptProgress(attemptId: string): Promise<PageProgress[]> {
    const response = await apiClient.get<PageProgress[]>(`${this.userURL}/attempts/${attemptId}/progress/`);
    return response.data;
  }

  // Admin Edit API Endpoints
  static async updateActivity(id: string, activityData: Partial<Activity>): Promise<Activity> {
    const response = await apiClient.put<Activity>(`${this.adminURL}/activities/${id}/`, activityData);
    return response.data;
  }

  static async updateActivityVersion(activityVersionId: string, versionData: any): Promise<any> {
    const response = await apiClient.put<any>(`${this.adminURL}/activity_versions/${activityVersionId}/`, versionData);
    return response.data;
  }

  static async createPage(pageData: any): Promise<any> {
    const response = await apiClient.post<any>(`${this.adminURL}/pages/`, pageData);
    return response.data;
  }

  static async updatePage(pageId: string, pageData: any): Promise<any> {
    const response = await apiClient.put<any>(`${this.adminURL}/pages/${pageId}/`, pageData);
    return response.data;
  }

  static async deletePage(pageId: string): Promise<void> {
    await apiClient.delete(`${this.adminURL}/pages/${pageId}/`);
  }

  static async createBlock(blockData: any): Promise<any> {
    const response = await apiClient.post<any>(`${this.adminURL}/blocks/`, blockData);
    return response.data;
  }

  static async updateBlock(blockId: string, blockData: any): Promise<any> {
    const response = await apiClient.put<any>(`${this.adminURL}/blocks/${blockId}/`, blockData);
    return response.data;
  }

  static async deleteBlock(blockId: string): Promise<void> {
    await apiClient.delete(`${this.adminURL}/blocks/${blockId}/`);
  }

  // Comprehensive save endpoint that handles activity, pages, and blocks in one transaction
  static async saveActivityEdits(id: string, saveData: {
    activity: Activity;
    activity_version: any;
    pages: any[];
    total_pages: number;
  }): Promise<any> {
    const response = await apiClient.put<any>(`${this.adminURL}/activities/${id}/save_edits/`, saveData);
    return response.data;
  }
}

// Export new results-related services and hooks
export * from './hooks';
export * from './ActivityResultsService';