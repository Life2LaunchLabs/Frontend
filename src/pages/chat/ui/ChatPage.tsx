import trainCarImage from '../../../assets/train_car.png'
import character1ChatImage from '../../../assets/character_1_chat.png'
import { useTheme } from '../../../theme/ThemeContext'
import { BottomNavigation } from '../../../components/BottomNav/BottomNavigation'

function ChatPage() {
  const { theme, tokens } = useTheme()

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
      position: 'relative' as const,
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100vh',
      padding: 0,
      margin: 0,
      pointerEvents: 'none' as const,
    },
    titleSection: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: tokens.spacing[8],
      paddingTop: tokens.spacing[12],
      pointerEvents: 'auto' as const,
    },
    title: {
      ...tokens.typography.headline.large,
      color: theme.onSurface,
      textAlign: 'center' as const,
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
      margin: 0,
    },
    contentArea: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    navSection: {
      position: 'fixed' as const,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 20,
      pointerEvents: 'auto' as const,
    }
  }

  return (
    <div style={styles.pageContainer}>
      <svg
        style={styles.backgroundSvg}
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="trainBackgroundChat"
            patternUnits="userSpaceOnUse"
            width="800"
            height="800"
          >
            <image
              href={trainCarImage}
              x="-100"
              y="-100"
              width="800"
              height="800"
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>
        <g transform="translate(0, 0)">
          <rect width="1000" height="1000" x="-100" y="-100" fill="url(#trainBackgroundChat)" />
          <image
            href={character1ChatImage}
            x="100"
            y="150"
            width="400"
            height="400"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </svg>
      
      <div style={styles.contentOverlay}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Chat</h1>
        </div>
        
        <div style={styles.contentArea}>
          {/* Chat interface will go here */}
        </div>
        
        <div style={styles.navSection}>
          <BottomNavigation />
        </div>
      </div>
    </div>
  )
}

export default ChatPage