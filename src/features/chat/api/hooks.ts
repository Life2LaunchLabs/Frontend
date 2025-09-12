import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChatService } from './ChatService';
import { formatApiError } from '../../../lib/api/utils';
import { useToast } from '../../../shared/components';
import type { 
  SendMessageRequest, 
  GetHistoryRequest, 
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
export const useChatHistory = (request: GetHistoryRequest = {}) => {
  return useQuery({
    queryKey: chatQueryKeys.history(request.session_id),
    queryFn: () => ChatService.getHistory(request),
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