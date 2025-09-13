// Chat API types and interfaces

/**
 * Chat message from/to backend
 */
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  session_id?: string;
}

/**
 * Chat session information
 */
export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

/**
 * Request to send a new chat message
 */
export interface SendMessageRequest {
  message: string;
  session_id?: string;
}

/**
 * Response when sending a chat message
 */
export interface SendMessageResponse {
  message: ChatMessage;
  session_id: string;
  response: ChatMessage;
}

/**
 * Request to get chat history
 */
export interface GetHistoryRequest {
  session_id?: string;
  limit?: number;
  offset?: number;
}

/**
 * Response containing chat history
 */
export interface GetHistoryResponse {
  messages: ChatMessage[];
  session_id: string;
  total_count: number;
  has_more: boolean;
}

/**
 * Response containing user's chat sessions
 */
export interface GetSessionsResponse {
  sessions: ChatSession[];
  total_count: number;
  has_more: boolean;
}

/**
 * Chat loading states
 */
export type ChatLoadingState = 'idle' | 'sending' | 'loading' | 'error';

/**
 * Chat error information
 */
export interface ChatError {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Session configuration for creating new chat sessions
 */
export interface SessionConfig {
  preset_key: string;
  title?: string;
}

/**
 * Preset information from backend
 */
export interface PresetInfo {
  presets: Record<string, {
    name: string;
    description: string;
    category: string;
    provider: string;
    model: string;
  }>;
  categories: string[];
  default_preset: string;
}