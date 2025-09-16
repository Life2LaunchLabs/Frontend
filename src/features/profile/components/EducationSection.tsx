import React from 'react';
import { useTheme } from '../../../styles';

export interface Education {
  degree: string;
  school: string;
  duration: string;
  gpa: string;
  relevant: string[];
}

export interface EducationSectionProps {
  education: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education
}) => {
  const { theme, tokens } = useTheme();

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
    educationList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
    },
    educationCard: {
      backgroundColor: theme.surfaceVariant,
      borderColor: theme.outline,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[6],
      border: `1px solid ${theme.outline}`,
    },
    degree: {
      ...tokens.typography.headline.small,
      color: theme.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[2],
      fontWeight: '600',
    },
    school: {
      ...tokens.typography.body.large,
      color: theme.primary,
      margin: 0,
      marginBottom: tokens.spacing[1],
      fontWeight: '500',
    },
    details: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      margin: 0,
      marginBottom: tokens.spacing[4],
    },
    courseworkSection: {
      marginTop: tokens.spacing[2],
    },
    courseworkTitle: {
      ...tokens.typography.body.medium,
      color: theme.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[2],
      fontWeight: '500',
    },
    courseworkContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: tokens.spacing[2],
    },
    courseChip: {
      padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
      borderRadius: tokens.borderRadius.full,
      backgroundColor: `rgba(${theme.primary.replace('#', '')}, 0.1)`,
      color: theme.onSurfaceVariant,
      fontSize: tokens.typography.body.small.fontSize,
    },
  });

  const styles = getStyles();

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0';
  };

  if (!education || education.length === 0) {
    return null;
  }

  return (
    <div style={styles.container} data-testid="education-section">
      <h2 style={styles.title}>Education</h2>

      <div style={styles.educationList}>
        {education.map((edu, index) => (
          <div key={index} style={styles.educationCard}>
            <h3 style={styles.degree}>{edu.degree}</h3>
            <p style={styles.school}>{edu.school}</p>
            <p style={styles.details}>
              {edu.duration} • GPA: {edu.gpa}
            </p>

            <div style={styles.courseworkSection}>
              <h4 style={styles.courseworkTitle}>Relevant Coursework:</h4>
              <div style={styles.courseworkContainer}>
                {edu.relevant.map((course, idx) => (
                  <span
                    key={idx}
                    style={{
                      ...styles.courseChip,
                      backgroundColor: `rgba(${hexToRgb(theme.primary)}, 0.1)`,
                    }}
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};