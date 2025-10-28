/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTheme } from '../../../styles';
import acornTalkImage from '../../../shared/assets/images/acorn_talk.png';

export interface ChatBuddyProps {
  message: string;
}

export const ChatBuddy: React.FC<ChatBuddyProps> = ({ message }) => {
  const { colors, tokens } = useTheme();

  const styles = {
    container: {
      display: 'flex',
      gap: tokens.spacing[4],
      alignItems: 'flex-start',
      width: '100%',
      padding: tokens.spacing[4],
      backgroundColor: 'transparent',
    },
    acornContainer: {
      flexShrink: 0,
      width: '80px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    acornImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain' as const,
    },
    messageBubble: {
      flex: 1,
      backgroundColor: colors.surfaceContainerHigh,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[5],
      boxShadow: tokens.shadows.small,
      position: 'relative' as const,
      // Speech bubble tail pointing left
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '-8px',
        top: '24px',
        width: 0,
        height: 0,
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        borderRight: `8px solid ${colors.surfaceContainerHigh}`,
      },
    },
    messageText: {
      ...tokens.typography.body.large,
      color: colors.onSurface,
      margin: 0,
      lineHeight: 1.6,
    },
  };

  return (
    <div css={styles.container}>
      <div css={styles.acornContainer}>
        <img src={acornTalkImage} alt="Chat buddy" css={styles.acornImage} />
      </div>
      <div css={styles.messageBubble}>
        <p css={styles.messageText}>{message}</p>
      </div>
    </div>
  );
};
