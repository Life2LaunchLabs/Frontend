import { apiClient } from '../../../lib/api';

export interface ActivitySubmission {
  id: string;
  activity_version: {
    id: string;
    version: number;
    title: string;
    description?: string;
    meta: any;
    is_published: boolean;
    created_at: string;
  };
  quest_instance?: {
    id: string;
    quest_definition: any;
    items: any;
    status: string;
    created_at: string;
  };
  started_at: string;
  completed_at: string;
  time_taken: string; // Duration as ISO string
  meta: any;
}

export interface SubmissionResponse {
  id: string;
  question_id: string;
  question_type: string;
  value: any;
  valid: boolean;
  meta: any;
  created_at: string;
}

export interface SubmissionDetails extends ActivitySubmission {
  responses: SubmissionResponse[];
}

export class ActivityResultsService {
  private static readonly BASE_URL = '/api';

  static async getActivityResults(activityId: string): Promise<ActivitySubmission[]> {
    const response = await apiClient.get(`${this.BASE_URL}/activities/results/activity/${activityId}/`);
    return response.data;
  }

  static async getSubmissionDetails(submissionId: string): Promise<SubmissionDetails> {
    const response = await apiClient.get(`${this.BASE_URL}/activities/submissions/${submissionId}/`);
    return response.data;
  }

  static async hasCompletedActivity(activityId: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`${this.BASE_URL}/activities/results/has-completed/${activityId}/`);
      return response.data.has_completed;
    } catch (error) {
      console.error('Error checking activity completion:', error);
      return false;
    }
  }
}