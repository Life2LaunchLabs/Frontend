import { apiClient } from '../../../lib/api';
import { UserAdminStatus, SetDefaultOrganizationRequest, SetDefaultOrganizationResponse } from '../types';

export class AdminService {
  private static baseURL = '/api';

  static async getAdminStatus(): Promise<UserAdminStatus> {
    const response = await apiClient.get<UserAdminStatus>(`${this.baseURL}/admin/status/`);
    return response.data;
  }

  static async setDefaultOrganization(organizationSlug: string): Promise<SetDefaultOrganizationResponse> {
    const request: SetDefaultOrganizationRequest = {
      organization_slug: organizationSlug
    };
    const response = await apiClient.post<SetDefaultOrganizationResponse>(
      `${this.baseURL}/admin/set-default-org/`,
      request
    );
    return response.data;
  }

  static async healthCheck(): Promise<{ status: string }> {
    const response = await apiClient.get<{ status: string }>(`${this.baseURL}/health/`);
    return response.data;
  }
}

// Re-export quest admin service
export { QuestAdminService } from './QuestAdminService';