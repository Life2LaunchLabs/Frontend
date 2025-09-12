import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import trainCarImage from '../../../shared/assets/images/train_car.png'
import character1Image from '../assets/images/character_1.png'
import character1IdleImage from '../assets/images/character_1_idle.png'
import { useTheme } from '../../../styles'
import { BottomNavigation } from '../../../shared/components'

function HomePage() {
  const { theme, tokens } = useTheme()
  const navigate = useNavigate()
  const [isGlowing, setIsGlowing] = useState(false)

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
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="trainBackground"
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
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
            <stop offset="30%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="70%" stopColor="rgba(255, 255, 255, 0.1)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        <rect width="1000" height="1000" fill="url(#trainBackground)" />
        <g>
          <ellipse
            cx="555"
            cy="505"
            rx="240"
            ry="200"
            fill="url(#glowGradient)"
            filter="url(#glow)"
            opacity={isGlowing ? 1 : 0}
            style={{
              transition: 'opacity 0.15s ease-in-out',
            }}
          />
          <image
            href={character1IdleImage}
            x="315"
            y="375"
            width="470"
            height="470"
            preserveAspectRatio="xMidYMid meet"
            opacity={isGlowing ? 0 : 1}
            style={{
              transition: 'opacity 0.15s ease-in-out',
            }}
          />
          <image
            href={character1Image}
            x="330"
            y="380"
            width="450"
            height="450"
            preserveAspectRatio="xMidYMid meet"
            opacity={isGlowing ? 1 : 0}
            style={{
              transition: 'opacity 0.15s ease-in-out',
            }}
          />
          <rect
            x="330"
            y="380"
            width="450"
            height="450"
            fill="transparent"
            style={{
              cursor: 'pointer',
            }}
            onMouseEnter={() => setIsGlowing(true)}
            onMouseLeave={() => setIsGlowing(false)}
            onClick={() => navigate('/chat')}
          />
        </g>
      </svg>
      
      <div style={styles.contentOverlay}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Welcome Back</h1>
        </div>
        
        <div style={styles.contentArea}>
          {/* Empty content area that fills the center */}
        </div>
        
        <div style={styles.navSection}>
          <BottomNavigation />
        </div>
      </div>
    </div>
  )
}

export default HomePage