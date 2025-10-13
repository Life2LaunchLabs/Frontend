import React from 'react';
import { useTheme } from '../../../styles';

export interface SkillBadge {
  name: string;
  color: string;
  earned: string;
}

export interface SkillBadgesGridProps {
  badges: SkillBadge[];
  asFragment?: boolean;
}

export const SkillBadgesGrid: React.FC<SkillBadgesGridProps> = ({
  badges,
  asFragment
}) => {
  const { colors, tokens } = useTheme();

  const Container: React.ElementType = asFragment ? React.Fragment : 'div';

  const getStyles = () => ({
    container: {
      backgroundColor: colors.surfaceContainer,
      borderColor: colors.outline,
      boxShadow: tokens.shadows.large,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[8],
      border: `1px solid ${colors.outline}`,
      marginBottom: tokens.spacing[8],
    },
    title: {
      ...tokens.typography.headline.medium,
      color: colors.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[6],
      fontWeight: '700',
    },
    badgesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: tokens.spacing[4],
    },
    badgeCard: {
      padding: tokens.spacing[4],
      borderRadius: tokens.borderRadius.medium,
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid',
    },
    badgeIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      margin: '0 auto',
      marginBottom: tokens.spacing[3],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '700',
      fontSize: '1.2rem',
    },
    badgeName: {
      ...tokens.typography.body.medium,
      color: colors.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[1],
      fontWeight: '500',
    },
    badgeEarned: {
      ...tokens.typography.body.small,
      color: colors.onSurfaceVariant,
      margin: 0,
    },
  });

  const styles = getStyles();

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0';
  };

  if (!badges || badges.length === 0) {
    return null;
  }

  return (
    <Container {...(!asFragment ? { style: styles.container, 'data-testid': 'skill-badges-grid' } : {})}>
      <h2 style={styles.title}>Featured Badges</h2>

      <div style={styles.badgesGrid}>
        {badges.map((badge, index) => (
          <div
            key={index}
            style={{
              ...styles.badgeCard,
              backgroundColor: `rgba(${hexToRgb(badge.color)}, 0.1)`,
              borderColor: `rgba(${hexToRgb(badge.color)}, 0.3)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = tokens.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                ...styles.badgeIcon,
                backgroundColor: badge.color,
              }}
            >
              ⭐
            </div>
            <h3 style={styles.badgeName}>{badge.name}</h3>
            <p style={styles.badgeEarned}>Earned {badge.earned}</p>
          </div>
        ))}
      </div>
    </Container>
  );
};