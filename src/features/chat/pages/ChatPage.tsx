/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { useTheme } from '../../../styles';
import { PageLayout } from '@shared/components';
import {
  MessageArea,
  ChatTextInput,
} from '../components';
import { ChatService, useStreamingChat } from '../api';

export const ChatPage: React.FC = () => {

  // Chat state
  const [message, setMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [isInitializing, setIsInitializing] = useState(true);

  // Streaming chat hook with enhanced features
  const {
    messages,
    currentStreamingMessage,
    isConnected,
    isStreaming,
    isLoadingHistory,
    sendMessage: sendStreamingMessage
  } = useStreamingChat(sessionId);
  
    const { tokens } = useTheme();

  // Initialize session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsInitializing(true);

        // Try to use existing session first (only within same browser session)
        const existingSessionId = sessionStorage.getItem('currentChatSessionId');
        if (existingSessionId) {
          // Verify the session is still valid by trying to get its config
          try {
            const sessionData = await ChatService.getSession(existingSessionId);
            console.log('Found existing session:', sessionData);

            // Set session ID - the useStreamingChat hook will load history automatically
            setSessionId(existingSessionId);
            setIsInitializing(false);
            return; // Use existing session
          } catch {
            console.log('Existing session invalid, creating new one');
            // Clear invalid session ID
            sessionStorage.removeItem('currentChatSessionId');
          }
        }

        // Create new session if no valid existing session
        // First get the default preset key
        const presetInfo = await ChatService.getPresetInfo();
        const response = await ChatService.createSession({
          preset_key: presetInfo.default_preset,
          title: 'Chat Session'
        });
        setSessionId(response.session_id);
        // Store session ID for settings page access (only for current browser session)
        sessionStorage.setItem('currentChatSessionId', response.session_id);
      } catch (error) {
        console.error('Failed to initialize session:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();
  }, []);

  // Get the latest assistant message
  const latestAssistantMessage = messages.length > 0
    ? messages[messages.length - 1]
    : 'Welcome! How can I help you today?';

  const handleSendMessage = async () => {
    if (message.trim() && sessionId && isConnected && !isStreaming) {
      try {
        // Request both emote and quick responses for enhanced chat experience
        sendStreamingMessage(message.trim(), {
          request_emote: false,
          request_quick_responses: false
        });
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };


  return (
    <PageLayout
      pageName="Chat"
      gridParams={{
        cols: [{ id: 'a', width: `minmax(${tokens.paneWidths.large}, ${tokens.paneWidths.large})` }],
        center: true,
        alignItems: 'stretch'
      }}
  // make the first stacked row (MessageArea) flex: 1fr; input stays min-content
  fillRowIndex={0}
      panes={[
        {
          content: (
            <MessageArea
              message={latestAssistantMessage}
              streamingMessage={currentStreamingMessage}
              isLoading={isInitializing || isLoadingHistory || !isConnected}
              isStreaming={isStreaming}
              characterName="Assistant"
            />
          ),
          
          css: { minHeight: 0, overflow: 'hidden' },
        },
        {
          content: (
            <ChatTextInput
              value={message}
              onChange={setMessage}
              onSend={handleSendMessage}
              disabled={!sessionId || !isConnected || isStreaming}
              placeholder={sessionId && isConnected ? "Type your message..." : "Connecting..."}
            />
          ),
        },
      ]}
    />
  );
};

export default ChatPage;
