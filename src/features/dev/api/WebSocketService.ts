/**
 * WebSocket service for streaming chat messages
 * Handles real-time communication with Django Channels backend
 */

export interface StreamMessage {
  type: 'stream_chunk' | 'stream_start' | 'stream_complete' | 'user_message_stored' | 'typing_indicator' | 'error' | 'connection_established' | 'message_received';
  chunk?: string;
  chunk_index?: number;
  message_id?: string;
  assistant_message?: Record<string, unknown>;
  user_message?: Record<string, unknown>;
  session_id?: string;
  usage_stats?: Record<string, unknown>;
  processing_info?: Record<string, unknown>;
  status?: string;
  message?: string;
  error_code?: string;
  timestamp?: number;
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

  sendMessage(message: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'send_message',
        message: message
      }));
    } else {
      console.error('WebSocket not connected');
    }
  }

  ping(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'ping' }));
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
    // Use the chunked streaming endpoint for better UX
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