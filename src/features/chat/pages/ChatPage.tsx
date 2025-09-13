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
  const [currentEmote, setCurrentEmote] = useState('😊 friendly');
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Streaming chat hook
  const {
    messages,
    currentStreamingMessage,
    isConnected,
    isStreaming,
    sendMessage: sendStreamingMessage
  } = useStreamingChat(sessionId);
  
  // Initialize session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsInitializing(true);
        const response = await ChatService.createSession({
          preset_key: 'claude_balanced',
          title: 'Chat Session'
        });
        setSessionId(response.session_id);
      } catch (error) {
        console.error('Failed to initialize session:', error);
        setCurrentEmote('😔 error');
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
  
  const quickInputs = [
    "Tell me more",
    "I understand",
    "What's next?",
    "Can you help with that?"
  ];

  const handleSendMessage = async () => {
    if (message.trim() && sessionId && isConnected && !isStreaming) {
      try {
        sendStreamingMessage(message.trim());
        setMessage('');
        setCurrentEmote('😊 friendly');
      } catch (error) {
        console.error('Failed to send message:', error);
        setCurrentEmote('😔 error');
      }
    }
  };

  const handleQuickInput = async (input: string) => {
    if (sessionId && isConnected && !isStreaming) {
      try {
        sendStreamingMessage(input);
        setCurrentEmote('😊 helpful');
      } catch (error) {
        console.error('Failed to send quick input:', error);
        setCurrentEmote('😔 error');
      }
    }
  };

  const handleResultsClick = () => {
    console.log('Results clicked');
  };

  const handleBackClick = () => {
    navigate(-1);
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
          />
        </div>

        {/* Main Chat Area */}
        <div style={styles.middleSection}>
          {/* Emote Bubble Area */}
          <div style={styles.emoteBubbleContainer}>
            <EmoteBubble 
              emote={currentEmote}
              position="top-right"
            />
          </div>

          {/* Message Area */}
          <div style={styles.messageSection}>
            <MessageArea
              message={latestAssistantMessage}
              streamingMessage={currentStreamingMessage}
              isLoading={isInitializing || !isConnected}
              isStreaming={isStreaming}
              characterName="Assistant"
            />
          </div>

          {/* Quick Input Chips */}
          <div style={styles.quickInputSection}>
            <QuickInputChips
              inputs={quickInputs}
              onInputClick={handleQuickInput}
              disabled={!sessionId || !isConnected || isStreaming}
              variant="filled"
            />
          </div>

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