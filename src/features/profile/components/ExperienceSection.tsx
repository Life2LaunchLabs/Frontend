import React, { useState } from 'react';
import { useTheme } from '../../../styles';

export interface Experience {
  id: number;
  type: 'work' | 'volunteer';
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  verified: boolean;
  responsibilities: string[];
}

export interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences
}) => {
  const { theme, tokens } = useTheme();
  const [expandedExperience, setExpandedExperience] = useState<number | null>(null);

  const getStyles = () => ({
    container: {
      backgroundColor: theme.surfaceContainer,
      borderColor: theme.outline,
      boxShadow: tokens.shadows.lg,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[8],
      border: `1px solid ${theme.outline}`,
      marginBottom: tokens.spacing[8],
    },
    title: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[6],
      fontWeight: '700',
    },
    experiencesList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
    },
    experienceCard: {
      backgroundColor: theme.surfaceVariant,
      borderColor: theme.outline,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[6],
      border: `1px solid ${theme.outline}`,
      cursor: 'pointer',
      transition: 'all 0.15s ease-in-out',
    },
    experienceHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    experienceInfo: {
      flex: 1,
    },
    experienceTopRow: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[3],
      marginBottom: tokens.spacing[2],
    },
    experienceTitle: {
      ...tokens.typography.headline.small,
      color: theme.onSurface,
      margin: 0,
      fontWeight: '600',
    },
    verifiedBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[1],
      padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
      borderRadius: tokens.borderRadius.full,
      backgroundColor: '#10B981',
      color: 'white',
      fontSize: tokens.typography.body.small.fontSize,
      fontWeight: '500',
    },
    typeBadge: {
      padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
      borderRadius: tokens.borderRadius.full,
      color: 'white',
      fontSize: tokens.typography.body.small.fontSize,
      fontWeight: '500',
    },
    workBadge: {
      backgroundColor: '#3B82F6',
    },
    volunteerBadge: {
      backgroundColor: '#8B5CF6',
    },
    companyInfo: {
      ...tokens.typography.body.large,
      color: theme.primary,
      margin: 0,
      marginBottom: tokens.spacing[1],
      fontWeight: '500',
    },
    duration: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      margin: 0,
      marginBottom: tokens.spacing[3],
    },
    description: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      lineHeight: '1.5',
      margin: 0,
    },
    expandIcon: {
      marginLeft: tokens.spacing[4],
      fontSize: '1.2rem',
      color: theme.onSurfaceVariant,
    },
    expandedContent: {
      marginTop: tokens.spacing[4],
      paddingTop: tokens.spacing[4],
      borderTop: `1px solid ${theme.outline}`,
    },
    responsibilitiesTitle: {
      ...tokens.typography.body.medium,
      color: theme.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[3],
      fontWeight: '500',
    },
    responsibilitiesList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
    },
    responsibilityItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: tokens.spacing[2],
      color: theme.onSurfaceVariant,
      fontSize: tokens.typography.body.medium.fontSize,
    },
    responsibilityBullet: {
      color: theme.primary,
      fontWeight: '700',
    },
  });

  const styles = getStyles();

  const toggleExperience = (id: number) => {
    setExpandedExperience(expandedExperience === id ? null : id);
  };

  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <div style={styles.container} data-testid="experience-section">
      <h2 style={styles.title}>Experience</h2>

      <div style={styles.experiencesList}>
        {experiences.map((exp) => (
          <div
            key={exp.id}
            style={styles.experienceCard}
            onClick={() => toggleExperience(exp.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = tokens.shadows.medium;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.experienceHeader}>
              <div style={styles.experienceInfo}>
                <div style={styles.experienceTopRow}>
                  <h3 style={styles.experienceTitle}>{exp.title}</h3>
                  {exp.verified && (
                    <div style={styles.verifiedBadge}>
                      ✓ Verified
                    </div>
                  )}
                  <div
                    style={{
                      ...styles.typeBadge,
                      ...(exp.type === 'work' ? styles.workBadge : styles.volunteerBadge),
                    }}
                  >
                    {exp.type === 'work' ? 'Work' : 'Volunteer'}
                  </div>
                </div>
                <p style={styles.companyInfo}>
                  {exp.company} • {exp.location}
                </p>
                <p style={styles.duration}>{exp.duration}</p>
                <p style={styles.description}>{exp.description}</p>
              </div>
              <div style={styles.expandIcon}>
                {expandedExperience === exp.id ? '−' : '+'}
              </div>
            </div>

            {expandedExperience === exp.id && (
              <div style={styles.expandedContent}>
                <h4 style={styles.responsibilitiesTitle}>
                  Key Responsibilities:
                </h4>
                <ul style={styles.responsibilitiesList}>
                  {exp.responsibilities.map((resp, index) => (
                    <li key={index} style={styles.responsibilityItem}>
                      <span style={styles.responsibilityBullet}>•</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};