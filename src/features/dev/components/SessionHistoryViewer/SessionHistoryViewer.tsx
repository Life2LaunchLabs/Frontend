import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../styles';
import { DevChatService } from '../../api';
import type { ChatSession } from '../../types';

export interface SessionHistoryViewerProps {
  refreshTrigger?: number;
}

interface Session extends ChatSession {
  preset_key?: string; // Make preset_key optional since API might not provide it
}

interface Message {
  id: string;
  role: string;
  content: string;
  created_at: string;
  metadata?: any;
}

export const SessionHistoryViewer: React.FC<SessionHistoryViewerProps> = ({ 
  refreshTrigger 
}) => {
  const { theme, tokens } = useTheme();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await DevChatService.getSessions();
      setSessions(result.sessions.map(session => ({ ...session, preset_key: session.model_config?.preset_key })));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (session: Session) => {
    setMessagesLoading(true);
    setSelectedSession(session);
    try {
      const result = await DevChatService.getMessageHistory(session.session_id);
      setMessages(result.messages);
    } catch (err: any) {
      setError(err.message);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [refreshTrigger]);

  const getStyles = () => ({
    container: {
      backgroundColor: theme.surfaceContainerLow,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[6],
      border: `1px solid ${theme.outline}`,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing[4],
    },
    title: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      margin: 0,
    },
    refreshButton: {
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      border: 'none',
      borderRadius: tokens.borderRadius.small,
      padding: `${tokens.spacing[2]}px ${tokens.spacing[4]}px`,
      fontSize: tokens.typography.body.small.fontSize,
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.6 : 1,
    },
    content: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: tokens.spacing[4],
      height: '500px',
    },
    sessionsPanel: {
      backgroundColor: theme.surface,
      borderRadius: tokens.borderRadius.small,
      border: `1px solid ${theme.outline}`,
      overflow: 'hidden',
    },
    sessionsPanelHeader: {
      ...tokens.typography.body.large,
      fontWeight: 600,
      color: theme.onSurface,
      padding: tokens.spacing[3],
      backgroundColor: theme.surfaceContainerHighest,
      borderBottom: `1px solid ${theme.outline}`,
    },
    sessionsList: {
      height: '450px',
      overflowY: 'auto' as const,
    },
    sessionItem: {
      padding: tokens.spacing[3],
      borderBottom: `1px solid ${theme.outline}`,
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
    sessionItemHover: {
      backgroundColor: theme.surfaceContainerHighest,
    },
    selectedSession: {
      backgroundColor: theme.primaryContainer,
      color: theme.onPrimaryContainer,
    },
    sessionTitle: {
      ...tokens.typography.body.medium,
      fontWeight: 600,
      margin: `0 0 ${tokens.spacing[1]}px 0`,
    },
    sessionMeta: {
      ...tokens.typography.body.small,
      opacity: 0.8,
      margin: `0 0 ${tokens.spacing[1]}px 0`,
    },
    sessionStats: {
      ...tokens.typography.body.small,
      opacity: 0.7,
      fontSize: '11px',
    },
    messagesPanel: {
      backgroundColor: theme.surface,
      borderRadius: tokens.borderRadius.small,
      border: `1px solid ${theme.outline}`,
      overflow: 'hidden',
    },
    messagesPanelHeader: {
      ...tokens.typography.body.large,
      fontWeight: 600,
      color: theme.onSurface,
      padding: tokens.spacing[3],
      backgroundColor: theme.surfaceContainerHighest,
      borderBottom: `1px solid ${theme.outline}`,
    },
    messagesList: {
      height: '450px',
      overflowY: 'auto' as const,
      padding: tokens.spacing[2],
    },
    message: {
      marginBottom: tokens.spacing[3],
      padding: tokens.spacing[3],
      borderRadius: tokens.borderRadius.small,
      border: `1px solid ${theme.outline}`,
    },
    userMessage: {
      backgroundColor: theme.primaryContainer,
      color: theme.onPrimaryContainer,
    },
    assistantMessage: {
      backgroundColor: theme.surfaceContainerHighest,
      color: theme.onSurface,
    },
    systemMessage: {
      backgroundColor: theme.surfaceVariant,
      color: theme.onSurfaceVariant,
      fontStyle: 'italic',
    },
    messageRole: {
      ...tokens.typography.body.small,
      fontWeight: 600,
      textTransform: 'capitalize' as const,
      marginBottom: tokens.spacing[1],
    },
    messageContent: {
      ...tokens.typography.body.medium,
      whiteSpace: 'pre-wrap' as const,
      marginBottom: tokens.spacing[1],
    },
    messageTimestamp: {
      ...tokens.typography.body.small,
      opacity: 0.7,
      fontSize: '11px',
    },
    emptyState: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      textAlign: 'center' as const,
      padding: tokens.spacing[8],
      fontStyle: 'italic',
    },
    error: {
      ...tokens.typography.body.medium,
      color: theme.error,
      textAlign: 'center' as const,
      padding: tokens.spacing[4],
      backgroundColor: theme.errorContainer,
      borderRadius: tokens.borderRadius.small,
    },
    loading: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      textAlign: 'center' as const,
      padding: tokens.spacing[4],
    },
  });

  const styles = getStyles();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (created: string, expires: string) => {
    const createdDate = new Date(created);
    const expiresDate = new Date(expires);
    const diffHours = Math.round((expiresDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60));
    return `${diffHours}h TTL`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📚 Session History</h3>
        <button style={styles.refreshButton} onClick={loadSessions} disabled={loading}>
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.content}>
        {/* Sessions List */}
        <div style={styles.sessionsPanel}>
          <div style={styles.sessionsPanelHeader}>
            Sessions ({sessions.length})
          </div>
          <div style={styles.sessionsList}>
            {loading && sessions.length === 0 ? (
              <div style={styles.loading}>Loading sessions...</div>
            ) : sessions.length === 0 ? (
              <div style={styles.emptyState}>No sessions found</div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.session_id}
                  style={{
                    ...styles.sessionItem,
                    ...(selectedSession?.session_id === session.session_id ? styles.selectedSession : {}),
                  }}
                  onClick={() => loadMessages(session)}
                  onMouseEnter={(e) => {
                    if (selectedSession?.session_id !== session.session_id) {
                      e.currentTarget.style.backgroundColor = theme.surfaceContainerHighest;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSession?.session_id !== session.session_id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={styles.sessionTitle}>{session.title}</div>
                  <div style={styles.sessionMeta}>
                    {session.preset_key} • {formatDate(session.created_at)}
                  </div>
                  <div style={styles.sessionStats}>
                    {session.message_count} messages • {formatDuration(session.created_at, session.expires_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messages List */}
        <div style={styles.messagesPanel}>
          <div style={styles.messagesPanelHeader}>
            {selectedSession ? `Messages: ${selectedSession.title}` : 'Select a session'}
          </div>
          <div style={styles.messagesList}>
            {messagesLoading ? (
              <div style={styles.loading}>Loading messages...</div>
            ) : !selectedSession ? (
              <div style={styles.emptyState}>Select a session to view messages</div>
            ) : messages.length === 0 ? (
              <div style={styles.emptyState}>No messages in this session</div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    ...styles.message,
                    ...(message.role === 'user' ? styles.userMessage :
                       message.role === 'assistant' ? styles.assistantMessage :
                       styles.systemMessage)
                  }}
                >
                  <div style={styles.messageRole}>{message.role}</div>
                  <div style={styles.messageContent}>{message.content}</div>
                  <div style={styles.messageTimestamp}>
                    {formatDate(message.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};