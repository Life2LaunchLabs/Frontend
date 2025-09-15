import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../../styles';
import { DevChatService, ChatWebSocketService, type StreamMessage } from '../../api';
import { authManager } from '../../../../lib/api/auth';

export interface LiveChatInterfaceProps {
  selectedPresetKey: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export const LiveChatInterface: React.FC<LiveChatInterfaceProps> = ({ 
  selectedPresetKey 
}) => {
  const { theme, tokens } = useTheme();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wsService, setWsService] = useState<ChatWebSocketService | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createNewSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await DevChatService.createSession({
        preset_key: selectedPresetKey,
        title: `Live Chat Test (${selectedPresetKey})`,
        ttl_hours: 2
      });
      setSessionId(result.session_id);
      setMessages([]);
      
      // Initialize WebSocket connection
      await initializeWebSocket(result.session_id);
      
      // Add system message
      setMessages([{
        id: 'system-start',
        role: 'system',
        content: `Started new chat session with ${selectedPresetKey} preset (WebSocket streaming enabled)`,
        timestamp: new Date().toISOString(),
      }]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || loading || isStreaming) return;
    if (!wsService) {
      setError('WebSocket not connected');
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setError(null);
    
    // Send message via WebSocket
    wsService.sendMessage(userMessage.content);
  };

  const clearChat = () => {
    // Disconnect WebSocket
    if (wsService) {
      wsService.disconnect();
      setWsService(null);
    }
    
    setMessages([]);
    setSessionId(null);
    setError(null);
    setIsStreaming(false);
    setCurrentStreamingMessage('');
  };

  const initializeWebSocket = async (sessionId: string) => {
    const token = authManager.getAccessToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const ws = new ChatWebSocketService(
      sessionId,
      token,
      handleWebSocketMessage,
      (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
      },
      () => {
        console.log('WebSocket disconnected');
        setWsService(null);
      }
    );

    try {
      await ws.connect();
      setWsService(ws);
    } catch (error: unknown) {
      setError(`Failed to connect WebSocket: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const handleWebSocketMessage = (message: StreamMessage) => {
    switch (message.type) {
      case 'connection_established':
        console.log('WebSocket connected successfully');
        break;

      case 'message_received':
        // Message acknowledged by server
        setLoading(false);
        setIsStreaming(true);
        setCurrentStreamingMessage('');
        break;

      case 'typing_indicator':
        if (message.status === 'idle') {
          setLoading(false);
          setIsStreaming(false);
        }
        break;

      case 'user_message_stored':
        // User message has been stored, assistant response incoming
        break;

      case 'stream_start':
        // Assistant response streaming has started
        setIsStreaming(true);
        setCurrentStreamingMessage('');
        break;

      case 'stream_chunk':
        // Append chunk to current streaming message
        if (message.chunk) {
          setCurrentStreamingMessage(prev => prev + message.chunk);
        }
        break;

      case 'stream_complete':
        // Streaming finished, add final message to messages
        setIsStreaming(false);
        if (message.assistant_message) {
          const assistantMsg = message.assistant_message as Record<string, unknown>;
          const assistantMessage: Message = {
            id: String(assistantMsg.id),
            role: 'assistant',
            content: String(assistantMsg.content),
            timestamp: String(assistantMsg.timestamp),
            metadata: message.usage_stats
          };
          setMessages(prev => [...prev, assistantMessage]);
        }
        setCurrentStreamingMessage('');
        break;

      case 'error':
        setError(message.message || 'Unknown error');
        setLoading(false);
        setIsStreaming(false);
        break;

      default:
        console.log('Unknown WebSocket message type:', message.type);
    }
  };

  // Clean up WebSocket on component unmount
  useEffect(() => {
    return () => {
      if (wsService) {
        wsService.disconnect();
      }
    };
  }, [wsService]);

  // Add CSS animation for cursor blinking
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getStyles = () => ({
    container: {
      backgroundColor: theme.surfaceContainerLow,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[6],
      border: `1px solid ${theme.outline}`,
      height: '600px',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing[4],
      paddingBottom: tokens.spacing[3],
      borderBottom: `1px solid ${theme.outline}`,
    },
    title: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      margin: 0,
    },
    sessionInfo: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
    },
    buttonGroup: {
      display: 'flex',
      gap: tokens.spacing[2],
    },
    button: {
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      border: 'none',
      borderRadius: tokens.borderRadius.small,
      padding: `${tokens.spacing[2]}px ${tokens.spacing[4]}px`,
      fontSize: tokens.typography.body.small.fontSize,
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.6 : 1,
    },
    secondaryButton: {
      backgroundColor: theme.surfaceContainerHighest,
      color: theme.onSurface,
      border: `1px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.small,
      padding: `${tokens.spacing[2]}px ${tokens.spacing[4]}px`,
      fontSize: tokens.typography.body.small.fontSize,
      cursor: 'pointer',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto' as const,
      marginBottom: tokens.spacing[4],
      padding: tokens.spacing[2],
      backgroundColor: theme.surface,
      borderRadius: tokens.borderRadius.small,
      border: `1px solid ${theme.outline}`,
    },
    message: {
      marginBottom: tokens.spacing[4],
      padding: tokens.spacing[3],
      borderRadius: tokens.borderRadius.small,
      maxWidth: '80%',
    },
    userMessage: {
      backgroundColor: theme.primaryContainer,
      color: theme.onPrimaryContainer,
      marginLeft: 'auto',
    },
    assistantMessage: {
      backgroundColor: theme.surfaceContainerHighest,
      color: theme.onSurface,
    },
    systemMessage: {
      backgroundColor: theme.surfaceVariant,
      color: theme.onSurfaceVariant,
      fontStyle: 'italic',
      textAlign: 'center' as const,
      margin: '0 auto',
    },
    messageContent: {
      ...tokens.typography.body.medium,
      margin: 0,
      whiteSpace: 'pre-wrap' as const,
    },
    messageTimestamp: {
      ...tokens.typography.body.small,
      opacity: 0.7,
      marginTop: tokens.spacing[1],
      fontSize: '11px',
    },
    messageMetadata: {
      ...tokens.typography.body.small,
      opacity: 0.8,
      marginTop: tokens.spacing[1],
      fontSize: '11px',
      color: theme.primary,
    },
    inputContainer: {
      display: 'flex',
      gap: tokens.spacing[3],
    },
    textInput: {
      flex: 1,
      padding: tokens.spacing[3],
      borderRadius: tokens.borderRadius.small,
      border: `1px solid ${theme.outline}`,
      backgroundColor: theme.surface,
      color: theme.onSurface,
      fontSize: tokens.typography.body.medium.fontSize,
      outline: 'none',
      resize: 'none' as const,
      minHeight: '44px',
      maxHeight: '120px',
    },
    sendButton: {
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      border: 'none',
      borderRadius: tokens.borderRadius.small,
      padding: `${tokens.spacing[3]}px ${tokens.spacing[5]}px`,
      fontSize: tokens.typography.body.medium.fontSize,
      cursor: (!inputMessage.trim() || !sessionId || loading || isStreaming) ? 'not-allowed' : 'pointer',
      opacity: (!inputMessage.trim() || !sessionId || loading || isStreaming) ? 0.6 : 1,
    },
    error: {
      ...tokens.typography.body.small,
      color: theme.error,
      textAlign: 'center' as const,
      marginBottom: tokens.spacing[3],
      padding: tokens.spacing[2],
      backgroundColor: theme.errorContainer,
      borderRadius: tokens.borderRadius.small,
    },
    emptyState: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      textAlign: 'center' as const,
      padding: tokens.spacing[8],
      fontStyle: 'italic',
    },
    streamingMessage: {
      opacity: 0.9,
      border: `2px dashed ${theme.primary}`,
    },
    cursor: {
      color: theme.primary,
      fontWeight: 'bold',
      animation: 'blink 1s infinite',
    },
  });

  const styles = getStyles();

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>💬 Live Chat Interface</h3>
        <div style={styles.sessionInfo}>
          {sessionId ? (
            <>
              <span style={{ color: '#4CAF50' }}>●</span>
              Session Active
            </>
          ) : (
            <>
              <span style={{ color: '#F44336' }}>●</span>
              No Session
            </>
          )}
        </div>
        <div style={styles.buttonGroup}>
          <button 
            style={styles.button} 
            onClick={createNewSession}
            disabled={loading}
          >
            {loading ? '⏳' : '🆕'} New Session
          </button>
          <button 
            style={styles.secondaryButton} 
            onClick={clearChat}
          >
            🧹 Clear
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            {sessionId 
              ? "Start chatting by typing a message below..." 
              : "Create a new session to start chatting"
            }
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div 
                key={message.id} 
                style={{
                  ...styles.message,
                  ...(message.role === 'user' ? styles.userMessage :
                     message.role === 'assistant' ? styles.assistantMessage :
                     styles.systemMessage)
                }}
              >
                <div style={styles.messageContent}>{message.content}</div>
                <div style={styles.messageTimestamp}>
                  {formatTimestamp(message.timestamp)}
                </div>
                {message.metadata && (
                  <div style={styles.messageMetadata}>
                    {String(message.metadata.provider)} • {String(message.metadata.model)} •
                    {message.metadata.input_tokens}→{message.metadata.output_tokens} tokens
                  </div>
                )}
              </div>
            ))}
            
            {/* Show streaming message while it's being typed */}
            {isStreaming && currentStreamingMessage && (
              <div 
                style={{
                  ...styles.message,
                  ...styles.assistantMessage,
                  ...styles.streamingMessage
                }}
              >
                <div style={styles.messageContent}>
                  {currentStreamingMessage}
                  <span style={styles.cursor}>|</span>
                </div>
                <div style={styles.messageTimestamp}>
                  Streaming...
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <textarea
          style={styles.textInput}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={sessionId ? "Type your message..." : "Create a session first"}
          disabled={!sessionId}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button 
          style={styles.sendButton}
          onClick={sendMessage}
          disabled={!inputMessage.trim() || !sessionId || loading || isStreaming}
        >
          {loading ? '⏳' : isStreaming ? '💬' : '📤'} {loading ? 'Sending...' : isStreaming ? 'Streaming...' : 'Send'}
        </button>
      </div>
    </div>
  );
};