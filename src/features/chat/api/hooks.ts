import { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChatService, ChatWebSocketService } from './ChatService';
import { formatApiError } from '../../../lib/api/utils';
import { useToast } from '../../../shared/components';
import type {
  SendMessageRequest,
  ChatSession
} from './types';

// Query keys for React Query caching
export const chatQueryKeys = {
  all: ['chat'] as const,
  sessions: () => [...chatQueryKeys.all, 'sessions'] as const,
  session: (id: string) => [...chatQueryKeys.all, 'session', id] as const,
  history: (sessionId?: string) => [...chatQueryKeys.all, 'history', sessionId] as const,
};

/**
 * Hook to send chat messages
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (request: SendMessageRequest) => {
      console.log('🚀 Sending message request:', request);
      try {
        const result = await ChatService.sendMessage(request);
        console.log('✅ Message sent successfully:', result);
        return result;
      } catch (error) {
        console.error('❌ Message send failed in mutationFn:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('🎉 onSuccess called with:', data);
      // Update history cache with new messages
      const historyKey = chatQueryKeys.history(data.session_id);
      queryClient.setQueryData(historyKey, (old: any) => {
        if (!old) return { messages: [data.message, data.response], session_id: data.session_id };
        return {
          ...old,
          messages: [...old.messages, data.message, data.response],
        };
      });

      // Invalidate sessions to update message counts
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.sessions() });
    },
    onError: (error) => {
      console.error('🔥 onError called with:', error);
      console.log('🔥 Error type:', typeof error);
      console.log('🔥 Error constructor:', error?.constructor?.name);
      
      const errorInfo = formatApiError(error);
      console.log('🔥 Formatted error info:', errorInfo);
      
      console.log('🍞 About to show toast...');
      if (errorInfo.type === 'error') {
        toast.showError(errorInfo.title, errorInfo.message);
      } else {
        toast.showWarning(errorInfo.title, errorInfo.message);
      }
      console.log('🍞 Toast should have been triggered');
    },
  });
};

/**
 * Hook to get chat history
 */
export const useChatHistory = (sessionId: string, limit: number = 50) => {
  return useQuery({
    queryKey: chatQueryKeys.history(sessionId),
    queryFn: () => ChatService.getMessageHistory(sessionId, limit),
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get user's chat sessions
 */
export const useChatSessions = () => {
  return useQuery({
    queryKey: chatQueryKeys.sessions(),
    queryFn: () => ChatService.getSessions(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a new chat session
 */
export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title?: string) => ChatService.createSession(title),
    onSuccess: (newSession) => {
      // Add new session to sessions cache
      queryClient.setQueryData(chatQueryKeys.sessions(), (old: any) => {
        if (!old) return { sessions: [newSession], total_count: 1, has_more: false };
        return {
          ...old,
          sessions: [newSession, ...old.sessions],
          total_count: old.total_count + 1,
        };
      });
    },
  });
};

/**
 * Hook to delete a chat session
 */
export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => ChatService.deleteSession(sessionId),
    onSuccess: (_, sessionId) => {
      // Remove session from cache
      queryClient.setQueryData(chatQueryKeys.sessions(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          sessions: old.sessions.filter((session: ChatSession) => session.id !== sessionId),
          total_count: Math.max(0, old.total_count - 1),
        };
      });

      // Remove session history cache
      queryClient.removeQueries({ queryKey: chatQueryKeys.history(sessionId) });
      queryClient.removeQueries({ queryKey: chatQueryKeys.session(sessionId) });
    },
  });
};

/**
 * Hook to update session title
 */
export const useUpdateSessionTitle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, title }: { sessionId: string; title: string }) => 
      ChatService.updateSessionTitle(sessionId, title),
    onSuccess: (updatedSession) => {
      // Update session in sessions cache
      queryClient.setQueryData(chatQueryKeys.sessions(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          sessions: old.sessions.map((session: ChatSession) => 
            session.id === updatedSession.id ? updatedSession : session
          ),
        };
      });

      // Update individual session cache
      queryClient.setQueryData(chatQueryKeys.session(updatedSession.id), updatedSession);
    },
  });
};

/**
 * Hook to get a specific session
 */
export const useSession = (sessionId: string) => {
  return useQuery({
    queryKey: chatQueryKeys.session(sessionId),
    queryFn: () => ChatService.getSession(sessionId),
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for streaming chat functionality with emote and quick response support
 */
export const useStreamingChat = (sessionId?: string) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentEmote, setCurrentEmote] = useState<string | null>('😊 friendly');
  const [currentQuickResponses, setCurrentQuickResponses] = useState<string[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const wsRef = useRef<ChatWebSocketService | null>(null);

  // Debug logging removed for cleaner console

  // Load message history when session ID changes
  useEffect(() => {
    if (!sessionId) return;

    const loadHistory = async () => {
      try {
        setIsLoadingHistory(true);
        console.log('📜 Loading history for session:', sessionId);

        const historyResponse = await ChatService.getMessageHistory(
          sessionId,
          50 // Load last 50 messages
        );

        console.log('📜 Loaded message history:', historyResponse);

        if (historyResponse.messages && historyResponse.messages.length > 0) {
          // Extract message contents in order
          const messageContents = historyResponse.messages.map((msg: any) => msg.content);
          setMessages(messageContents);

          // Try to restore the last emote from the most recent assistant message
          const lastAssistantMessage = historyResponse.messages
            .reverse()
            .find((msg: any) => msg.role === 'assistant');

          if (lastAssistantMessage?.emote_data) {
            const { emote, emote_glyph } = lastAssistantMessage.emote_data;
            if (emote_glyph && emote) {
              const formattedEmote = `${emote_glyph} ${emote}`;
              console.log('🎭 Restoring emote from history:', formattedEmote);
              setCurrentEmote(formattedEmote);
            } else if (emote_glyph) {
              console.log('🎭 Restoring emote glyph from history:', emote_glyph);
              setCurrentEmote(emote_glyph);
            }
          }

          console.log('📜 Restored', messageContents.length, 'messages');
        } else {
          console.log('📜 No message history found, starting fresh');
          // Reset to initial state for empty sessions
          setMessages([]);
          setCurrentEmote('😊 friendly');
        }
      } catch (error) {
        console.error('📜 Failed to load message history:', error);
        // Don't show error to user, just start fresh
        setMessages([]);
        setCurrentEmote('😊 friendly');
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const connectWebSocket = async () => {
      try {
        const wsService = ChatService.createWebSocketService(
          sessionId,
          (message) => {
            switch (message.type) {
              case 'emote':
                // Handle emote display (stage 1 of response pipeline)
                console.log('🎭 Received emote message:', message);
                if (message.emote_glyph && message.emote) {
                  const formattedEmote = `${message.emote_glyph} ${message.emote}`;
                  console.log('🎭 Setting emote to:', formattedEmote);
                  setCurrentEmote(formattedEmote);
                } else if (message.emote_glyph) {
                  console.log('🎭 Setting emote to glyph only:', message.emote_glyph);
                  setCurrentEmote(message.emote_glyph);
                }
                break;

              case 'stream_start':
                // Clear previous quick responses and start streaming (stage 2)
                setCurrentQuickResponses([]);
                setCurrentStreamingMessage('');
                setIsStreaming(true);
                break;

              case 'stream_chunk':
                if (message.chunk) {
                  setCurrentStreamingMessage(prev => prev + message.chunk);
                }
                break;

              case 'stream_complete':
                // Complete streaming response (end of stage 2)
                if (message.assistant_message?.content) {
                  setMessages(prev => [...prev, message.assistant_message.content]);
                }
                setCurrentStreamingMessage('');
                setIsStreaming(false);
                // Keep emote persistent - don't clear it
                break;

              case 'quick_responses':
                // Handle quick response options (stage 3 of response pipeline)
                if (message.quick_replies) {
                  setCurrentQuickResponses(message.quick_replies);
                }
                break;

              case 'error':
                console.error('WebSocket error:', message.message);
                setIsStreaming(false);
                setCurrentQuickResponses([]);
                // Don't clear emote on error - let it persist
                break;
            }
          },
          (error) => {
            console.error('WebSocket connection error:', error);
            setIsConnected(false);
          },
          () => {
            setIsConnected(false);
          }
        );

        await wsService.connect();
        wsRef.current = wsService;
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
        wsRef.current = null;
      }
      setIsConnected(false);
    };
  }, [sessionId]);

  const sendMessage = useCallback((message: string, options?: {
    request_emote?: boolean;
    request_quick_responses?: boolean;
  }) => {
    if (wsRef.current && isConnected) {
      setMessages(prev => [...prev, message]);
      wsRef.current.sendMessage(message, options);
    }
  }, [isConnected]);

  // Debug logging removed for cleaner console

  return {
    messages,
    currentStreamingMessage,
    isConnected,
    isStreaming,
    isLoadingHistory,
    currentEmote,
    currentQuickResponses,
    sendMessage
  };
};