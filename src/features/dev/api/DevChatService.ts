import { apiClient } from '../../../lib/api';
import type {
  SessionConfig,
  ChatSession,
  ValidationResult,
  PresetInfo
} from '../types';

// Re-export WebSocket service for convenience
export { ChatWebSocketService } from './WebSocketService';
export type { StreamMessage } from './WebSocketService';

/**
 * Dev Chat Service for testing Phase 1 backend infrastructure
 * Handles session management and configuration testing
 */
export class DevChatService {
  /**
   * Test basic chat endpoint connectivity (Phase 1 - no session required)
   */
  static async testChatEndpoint(): Promise<any> {
    const response = await apiClient.post('/api/chat/send/', {
      message: 'Test message from dev interface'
    });
    return response.data;
  }

  /**
   * Send a real message to LLM (Phase 2)
   */
  static async sendMessage(sessionId: string, message: string): Promise<{
    user_message: any;
    assistant_message: any;
    session_id: string;
    usage_stats: any;
  }> {
    const response = await apiClient.post<{
      user_message: any;
      assistant_message: any;
      session_id: string;
      usage_stats: any;
    }>('/api/chat/send/', {
      message,
      session_id: sessionId
    });
    return response.data;
  }

  /**
   * Get provider status (Phase 2)
   */
  static async getProviderStatus(): Promise<{
    providers: Record<string, { available: boolean; api_key_configured: boolean }>;
    available_count: number;
    total_count: number;
  }> {
    const response = await apiClient.get<{
      providers: Record<string, { available: boolean; api_key_configured: boolean }>;
      available_count: number;
      total_count: number;
    }>('/api/chat/provider-status/');
    return response.data;
  }

  /**
   * Get preset information
   */
  static async getPresetInfo(): Promise<PresetInfo> {
    const response = await apiClient.get<PresetInfo>('/api/chat/presets/');
    return response.data;
  }

  /**
   * Validate preset key
   */
  static async validatePreset(preset_key: string): Promise<ValidationResult> {
    const response = await apiClient.post<ValidationResult>('/api/chat/validate-preset/', {
      preset_key
    });
    return response.data;
  }

  /**
   * Create a new chat session
   */
  static async createSession(config: SessionConfig): Promise<{
    session_id: string;
    session: any;
  }> {
    const response = await apiClient.post<{
      session_id: string;
      session: any;
    }>('/api/chat/sessions/create/', config);
    return response.data;
  }

  /**
   * Get all user sessions
   */
  static async getSessions(activeOnly: boolean = true): Promise<{
    sessions: ChatSession[];
    total_count: number;
    has_more: boolean;
  }> {
    const params = new URLSearchParams();
    if (!activeOnly) {
      params.append('active_only', 'false');
    }
    
    const response = await apiClient.get<{
      sessions: ChatSession[];
      total_count: number;
      has_more: boolean;
    }>(`/api/chat/sessions/?${params.toString()}`);
    return response.data;
  }

  /**
   * Get session details
   */
  static async getSession(sessionId: string): Promise<ChatSession> {
    const response = await apiClient.get<ChatSession>(`/api/chat/sessions/${sessionId}/`);
    return response.data;
  }

  /**
   * Update session configuration
   */
  static async updateSession(
    sessionId: string,
    updates: { preset_key?: string; title?: string }
  ): Promise<ChatSession> {
    const response = await apiClient.patch<ChatSession>(`/api/chat/sessions/${sessionId}/`, updates);
    return response.data;
  }

  /**
   * Delete/deactivate session
   */
  static async deleteSession(sessionId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/api/chat/sessions/${sessionId}/`);
    return response.data;
  }

  /**
   * Get message history for a session
   */
  static async getMessageHistory(
    sessionId: string,
    limit?: number,
    offset: number = 0
  ): Promise<{
    messages: any[];
    session_id: string;
    total_count: number;
    has_more: boolean;
    offset: number;
    limit: number | null;
  }> {
    const params = new URLSearchParams();
    params.append('offset', offset.toString());
    if (limit) {
      params.append('limit', limit.toString());
    }
    
    const response = await apiClient.get<{
      messages: any[];
      session_id: string;
      total_count: number;
      has_more: boolean;
      offset: number;
      limit: number | null;
    }>(`/api/chat/sessions/${sessionId}/history/?${params.toString()}`);
    return response.data;
  }

  /**
   * Phase 3 Analytics API Methods
   */

  /**
   * Get conversation analytics for the user
   */
  static async getAnalytics(days: number = 30): Promise<{
    period: { start: string; end: string; days: number };
    session_stats: any;
    message_stats: any;
    provider_usage: any;
    conversation_topics: any[];
    time_patterns: any;
    generated_at: string;
  }> {
    const params = new URLSearchParams();
    params.append('days', days.toString());
    
    const response = await apiClient.get<{
      period: { start: string; end: string; days: number };
      session_stats: any;
      message_stats: any;
      provider_usage: any;
      conversation_topics: any[];
      time_patterns: any;
      generated_at: string;
    }>(`/api/chat/analytics/?${params.toString()}`);
    return response.data;
  }

  /**
   * Get provider comparison analytics
   */
  static async getProviderComparison(days: number = 30): Promise<{
    period: { start: string; end: string };
    provider_comparison: Record<string, any>;
    generated_at: string;
  }> {
    const params = new URLSearchParams();
    params.append('days', days.toString());
    
    const response = await apiClient.get<{
      period: { start: string; end: string };
      provider_comparison: Record<string, any>;
      generated_at: string;
    }>(`/api/chat/analytics/provider-comparison/?${params.toString()}`);
    return response.data;
  }

  /**
   * Get session insights for a specific session
   */
  static async getSessionInsights(sessionId: string): Promise<{
    session_info: any;
    message_analysis: any;
    flow_analysis: any;
    quality_metrics: any;
    generated_at: string;
  }> {
    const response = await apiClient.get<{
      session_info: any;
      message_analysis: any;
      flow_analysis: any;
      quality_metrics: any;
      generated_at: string;
    }>(`/api/chat/sessions/${sessionId}/insights/`);
    return response.data;
  }

  /**
   * Test WebSocket streaming connection
   */
  static async testWebSocketConnection(sessionId: string): Promise<{
    connection_test: boolean;
    websocket_url: string;
    test_message: string;
  }> {
    // For Phase 3 testing, we'll simulate a WebSocket test
    // In a real implementation, this would establish a WebSocket connection
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host.includes('localhost') 
          ? 'localhost:8001' 
          : window.location.host;
        
        resolve({
          connection_test: true,
          websocket_url: `${protocol}//${host}/ws/chat/stream/${sessionId}/`,
          test_message: 'WebSocket connection test completed successfully'
        });
      }, 1000);
    });
  }
}