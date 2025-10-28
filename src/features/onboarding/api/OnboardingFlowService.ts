import { apiClient } from '../../../lib/api';
import { FlowConfig, FlowState, FlowProgressUpdate, FlowInitializeRequest } from '../types';

/**
 * Service for managing onboarding flow state via backend API
 */
export class OnboardingFlowService {
  private static baseURL = '/api/public/onboarding/flow';

  /**
   * Get the flow configuration
   */
  static async getFlowConfig(): Promise<FlowConfig> {
    const response = await apiClient.get<FlowConfig>(`${this.baseURL}/config/`);
    return response.data;
  }

  /**
   * Initialize a new onboarding flow
   */
  static async initializeFlow(request: FlowInitializeRequest = {}): Promise<FlowState> {
    const response = await apiClient.post<FlowState>(`${this.baseURL}/initialize/`, request);
    return response.data;
  }

  /**
   * Get the current flow state from session
   */
  static async getFlowState(): Promise<FlowState> {
    const response = await apiClient.get<FlowState>(`${this.baseURL}/state/`);
    return response.data;
  }

  /**
   * Update flow progress (complete a step, navigate, etc.)
   */
  static async updateFlowProgress(update: FlowProgressUpdate): Promise<FlowState> {
    const response = await apiClient.post<FlowState>(`${this.baseURL}/progress/`, update);
    return response.data;
  }

  /**
   * Mark the entire flow as complete
   */
  static async completeFlow(): Promise<FlowState> {
    const response = await apiClient.post<FlowState>(`${this.baseURL}/complete/`);
    return response.data;
  }
}
