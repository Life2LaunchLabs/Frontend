import { apiClient, API_ENDPOINTS } from '../../../lib/api';
import type { 
  SendMessageRequest, 
  SendMessageResponse, 
  GetHistoryRequest, 
  GetHistoryResponse, 
  GetSessionsResponse,
  ChatSession 
} from './types';

/**
 * Chat service for backend communication
 * Handles all chat-related API calls and business logic
 */
export class ChatService {
  /**
   * Send a message and get AI response
   */
  static async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await apiClient.post<SendMessageResponse>(
      API_ENDPOINTS.CHAT.SEND, 
      request
    );
    return response.data;
  }

  /**
   * Get chat history for a session
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

    const endpoint = `${API_ENDPOINTS.CHAT.HISTORY}?${queryParams.toString()}`;
    const response = await apiClient.get<GetHistoryResponse>(endpoint);
    return response.data;
  }

  /**
   * Get list of user's chat sessions
   */
  static async getSessions(): Promise<GetSessionsResponse> {
    const response = await apiClient.get<GetSessionsResponse>(API_ENDPOINTS.CHAT.SESSIONS);
    return response.data;
  }

  /**
   * Create a new chat session
   */
  static async createSession(title?: string): Promise<ChatSession> {
    const response = await apiClient.post<ChatSession>(API_ENDPOINTS.CHAT.SESSIONS, {
      title: title || 'New Chat'
    });
    return response.data;
  }

  /**
   * Delete a chat session
   */
  static async deleteSession(sessionId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.CHAT.SESSIONS}/${sessionId}`);
  }

  /**
   * Update session title
   */
  static async updateSessionTitle(sessionId: string, title: string): Promise<ChatSession> {
    const response = await apiClient.patch<ChatSession>(
      `${API_ENDPOINTS.CHAT.SESSIONS}/${sessionId}`, 
      { title }
    );
    return response.data;
  }

  /**
   * Get a specific session details
   */
  static async getSession(sessionId: string): Promise<ChatSession> {
    const response = await apiClient.get<ChatSession>(
      `${API_ENDPOINTS.CHAT.SESSIONS}/${sessionId}`
    );
    return response.data;
  }
}