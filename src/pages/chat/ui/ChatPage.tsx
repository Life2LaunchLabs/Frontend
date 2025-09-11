import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import trainCarImage from '../../../assets/train_car.png';
import character1ChatImage from '../../../assets/character_1_chat.png';
import { useTheme } from '../../../theme/ThemeContext';
import { 
  ChatTitleBar, 
  EmoteBubble, 
  MessageArea, 
  QuickInputChips, 
  ChatTextInput,
  type AgendaItem 
} from '../../../components';

function ChatPage() {
  const { theme, tokens } = useTheme();
  const navigate = useNavigate();
  
  // Demo state - replace with actual chat context
  const [message, setMessage] = useState('');
  const [chatMessage, setChatMessage] = useState('Welcome! How can I help you today?');
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmote, setCurrentEmote] = useState('😊 friendly');
  
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
    if (message.trim() && !isLoading) {
      setIsLoading(true);
      // Simulate sending message
      setTimeout(() => {
        setChatMessage(`I received: "${message}". That's interesting! Let me think about that...`);
        setMessage('');
        setIsLoading(false);
        setCurrentEmote('🤔 thinking');
      }, 1000);
    }
  };

  const handleQuickInput = async (input: string) => {
    if (!isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setChatMessage(`You said: "${input}". Great choice! What would you like to explore next?`);
        setIsLoading(false);
        setCurrentEmote('😊 helpful');
      }, 800);
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
              message={chatMessage}
              isLoading={isLoading}
              characterName="Assistant"
            />
          </div>

          {/* Quick Input Chips */}
          <div style={styles.quickInputSection}>
            <QuickInputChips
              inputs={quickInputs}
              onInputClick={handleQuickInput}
              disabled={isLoading}
              variant="filled"
            />
          </div>

          {/* Text Input */}
          <div style={styles.inputSection}>
            <ChatTextInput
              value={message}
              onChange={setMessage}
              onSend={handleSendMessage}
              disabled={isLoading}
              placeholder="Type your message..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;