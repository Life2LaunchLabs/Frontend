import { apiClient } from '../../../lib/api';
import { authManager } from '../../../lib/api/auth';
import type { 
  SendMessageRequest, 
  SendMessageResponse, 
  GetHistoryRequest, 
  GetHistoryResponse, 
  GetSessionsResponse,
  ChatSession,
  SessionConfig,
  PresetInfo
} from './types';

export interface StreamMessage {
  type: 'stream_chunk' | 'stream_start' | 'stream_complete' | 'user_message_stored' | 'typing_indicator' | 'error' | 'connection_established' | 'message_received' | 'emote' | 'quick_responses';
  chunk?: string;
  chunk_index?: number;
  message_id?: string;
  assistant_message?: any;
  user_message?: any;
  session_id?: string;
  usage_stats?: any;
  processing_info?: any;
  status?: string;
  message?: string;
  error_code?: string;
  timestamp?: number;
  // New fields for control features
  emote?: string;
  emote_glyph?: string;
  quick_replies?: string[];
}

export class ChatWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(
    private sessionId: string,
    private token: string,
    private onMessage: (message: StreamMessage) => void,
    private onError?: (error: Event) => void,
    private onClose?: () => void
  ) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = this.getWebSocketUrl();
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.onMessage(data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.onError?.(error);
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          this.handleDisconnection();
          this.onClose?.();
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  sendMessage(message: string, options?: {
    request_emote?: boolean;
    request_quick_responses?: boolean;
  }): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'send_message',
        message: message,
        request_emote: options?.request_emote || false,
        request_quick_responses: options?.request_quick_responses || false
      }));
    } else {
      console.error('WebSocket not connected');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private getWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.DEV ? 'localhost:8001' : window.location.host;
    return `${protocol}//${host}/ws/chat/stream-chunked/${this.sessionId}/?token=${this.token}`;
  }

  private handleDisconnection(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect().catch(() => {
          // Reconnection failed, will try again if under limit
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }
}

/**
 * Chat service for backend communication using new Phase 3 framework
 * Handles session management, WebSocket streaming, and API calls
 */
export class ChatService {
  /**
   * Get preset information
   */
  static async getPresetInfo(): Promise<PresetInfo> {
    const response = await apiClient.get<PresetInfo>('/api/chat/presets/');
    return response.data;
  }

  /**
   * Create a new chat session with preset configuration
   */
  static async createSession(config: SessionConfig): Promise<{
    session_id: string;
    session: any;
  }> {
    const response = await apiClient.post('/api/chat/sessions/create/', config);
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
    
    const response = await apiClient.get(`/api/chat/sessions/${sessionId}/history/?${params.toString()}`);
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
    
    const response = await apiClient.get(`/api/chat/sessions/?${params.toString()}`);
    return response.data;
  }

  /**
   * Create WebSocket service for streaming chat
   */
  static createWebSocketService(
    sessionId: string,
    onMessage: (message: StreamMessage) => void,
    onError?: (error: Event) => void,
    onClose?: () => void
  ): ChatWebSocketService {
    const token = authManager.getAccessToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    return new ChatWebSocketService(sessionId, token, onMessage, onError, onClose);
  }

  /**
   * Delete/deactivate session
   */
  static async deleteSession(sessionId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/api/chat/sessions/${sessionId}/`);
    return response.data;
  }

  /**
   * Legacy send message method (for fallback)
   */
  static async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await apiClient.post<SendMessageResponse>('/api/chat/send/', request);
    return response.data;
  }

  /**
   * Get chat history (legacy method)
   */
  static async getHistory(request: GetHistoryRequest = {}): Promise<GetHistoryResponse> {
    const queryParams = new URLSearchParams();
    
    if (request.session_id) {
      queryParams.append('session_id', request.session_id);
    }
    if (request.limit) {
      queryParams.append('limit', request.limit.toString());
    }
    if (request.offset) {
      queryParams.append('offset', request.offset.toString());
    }

    const endpoint = `/api/chat/history/?${queryParams.toString()}`;
    const response = await apiClient.get<GetHistoryResponse>(endpoint);
    return response.data;
  }

  /**
   * Create a new chat session (legacy)
   */
  static async createLegacySession(title?: string): Promise<ChatSession> {
    const response = await apiClient.post<ChatSession>('/api/chat/sessions/', {
      title: title || 'New Chat'
    });
    return response.data;
  }

  /**
   * Update session title
   */
  static async updateSessionTitle(sessionId: string, title: string): Promise<ChatSession> {
    const response = await apiClient.patch<ChatSession>(
      `/api/chat/sessions/${sessionId}/`, 
      { title }
    );
    return response.data;
  }

  /**
   * Get a specific session details
   */
  static async getSession(sessionId: string): Promise<ChatSession> {
    const response = await apiClient.get<ChatSession>(
      `/api/chat/sessions/${sessionId}/`
    );
    return response.data;
  }

  /**
   * Update session configuration
   */
  static async updateSession(sessionId: string, updates: {
    preset_key?: string;
    title?: string;
    custom_system_prompt?: string;
    custom_control_instructions?: string[];
    quick_input_generation_instructions?: string;
    context_id?: string;
  }): Promise<ChatSession> {
    const response = await apiClient.patch<ChatSession>(
      `/api/chat/sessions/${sessionId}/`,
      updates
    );
    return response.data;
  }
}