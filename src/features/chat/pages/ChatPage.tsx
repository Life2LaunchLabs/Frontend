import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import trainCarImage from '../../../shared/assets/images/train_car.png';
import character1ChatImage from '../assets/images/character_1_chat.png';
import { useTheme } from '../../../styles';
import { 
  ChatTitleBar, 
  EmoteBubble, 
  MessageArea, 
  QuickInputChips, 
  ChatTextInput,
  type AgendaItem 
} from '../components';
import { ChatService, useStreamingChat } from '../api';

function ChatPage() {
  const { tokens } = useTheme();
  const navigate = useNavigate();
  
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
    currentEmote,
    currentQuickResponses,
    sendMessage: sendStreamingMessage
  } = useStreamingChat(sessionId);
  
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
        const response = await ChatService.createSession({
          title: 'Chat Session'
        });
        setSessionId(response.session_id);
        // Store session ID for settings page access (only for current browser session)
        sessionStorage.setItem('currentChatSessionId', response.session_id);
      } catch (error) {
        console.error('Failed to initialize session:', error);
        // Error handling - emote will persist from streaming hook
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
  
  // Demo agenda data
  const agendaItems: AgendaItem[] = [
    { id: '1', text: 'Get to know each other', status: 'completed' },
    { id: '2', text: 'Discuss your goals', status: 'completed' },
    { id: '3', text: 'Create action plan', status: 'in_progress' },
    { id: '4', text: 'Schedule follow-up', status: 'not_started' },
  ];
  
  // No default quick inputs - they should only come from the API

  const handleSendMessage = async () => {
    if (message.trim() && sessionId && isConnected && !isStreaming) {
      try {
        // Request both emote and quick responses for enhanced chat experience
        sendStreamingMessage(message.trim(), {
          request_emote: true,
          request_quick_responses: true
        });
        setMessage('');
        // Don't override streaming emote - let it persist
      } catch (error) {
        console.error('Failed to send message:', error);
        // Error handling - emote will persist from streaming hook
      }
    }
  };

  const handleQuickInput = async (input: string) => {
    if (sessionId && isConnected && !isStreaming) {
      try {
        // Also request emote and quick responses for quick inputs
        sendStreamingMessage(input, {
          request_emote: true,
          request_quick_responses: true
        });
        // Don't override streaming emote - let it persist
      } catch (error) {
        console.error('Failed to send quick input:', error);
        // Error handling - emote will persist from streaming hook
      }
    }
  };

  const handleResultsClick = () => {
    console.log('Results clicked');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSettingsClick = () => {
    navigate('/dev/chat_settings');
  };

  const styles = {
    pageContainer: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
    },
    backgroundSvg: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    contentOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column' as const,
      padding: 0,
      margin: 0,
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxSizing: 'border-box' as const,
    },
    titleBarSection: {
      position: 'absolute' as const,
      top: tokens.spacing[4],
      left: tokens.spacing[4],
      right: tokens.spacing[4],
      zIndex: 20,
    },
    middleSection: {
      flex: 1,
      position: 'relative' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: 0, // Important for flex children to shrink
      paddingTop: '120px', // Space for absolutely positioned title bar
      paddingLeft: tokens.spacing[4],
      paddingRight: tokens.spacing[4],
      paddingBottom: tokens.spacing[4],
      boxSizing: 'border-box' as const,
    },
    emoteBubbleContainer: {
      position: 'relative' as const,
      flex: '0 0 auto',
      height: '80px', // Space for emote bubble
    },
    messageSection: {
      flex: 1,
      minHeight: 0, // Important for flex children to shrink
      marginBottom: tokens.spacing[4],
    },
    quickInputSection: {
      marginBottom: tokens.spacing[4],
    },
    inputSection: {
      flex: '0 0 auto',
    },
  };

  return (
    <div style={styles.pageContainer}>
      <svg
        style={styles.backgroundSvg}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="trainBackgroundChat"
            patternUnits="userSpaceOnUse"
            width="1000"
            height="1000"
          >
            <image
              href={trainCarImage}
              x="0"
              y="0"
              width="1000"
              height="1000"
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>
        <rect width="1000" height="1000" fill="url(#trainBackgroundChat)" />
        <image
          href={character1ChatImage}
          x="315"
          y="375"
          width="470"
          height="470"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
      
      <div style={styles.contentOverlay}>
        {/* Chat Title Bar - Absolutely Positioned */}
        <div style={styles.titleBarSection}>
          <ChatTitleBar
            title="Chat Session"
            items={agendaItems}
            onResultsClick={handleResultsClick}
            onBackClick={handleBackClick}
            onSettingsClick={handleSettingsClick}
          />
        </div>

        {/* Main Chat Area */}
        <div style={styles.middleSection}>
          {/* Emote Bubble Area */}
          <div style={styles.emoteBubbleContainer}>
            <EmoteBubble
              emote={currentEmote || '😊 friendly'}
              position="top-right"
            />
          </div>

          {/* Message Area */}
          <div style={styles.messageSection}>
            <MessageArea
              message={latestAssistantMessage}
              streamingMessage={currentStreamingMessage}
              isLoading={isInitializing || isLoadingHistory || !isConnected}
              isStreaming={isStreaming}
              characterName="Assistant"
            />
          </div>

          {/* Quick Input Chips - Only show when available from API */}
          {currentQuickResponses.length > 0 && (
            <div style={styles.quickInputSection}>
              <QuickInputChips
                inputs={currentQuickResponses}
                onInputClick={handleQuickInput}
                disabled={!sessionId || !isConnected || isStreaming}
                variant="filled"
              />
            </div>
          )}

          {/* Text Input */}
          <div style={styles.inputSection}>
            <ChatTextInput
              value={message}
              onChange={setMessage}
              onSend={handleSendMessage}
              disabled={!sessionId || !isConnected || isStreaming}
              placeholder={sessionId && isConnected ? "Type your message..." : "Connecting..."}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;