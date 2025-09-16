import React from 'react';
import { useTheme } from '../../../styles';

export interface SkillCategory {
  title: string;
  skills: string[];
  color: string;
}

export interface SkillsSectionProps {
  skillCategories: SkillCategory[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skillCategories
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
    skillsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: tokens.spacing[6],
    },
    categoryContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    categoryTitle: {
      ...tokens.typography.body.large,
      color: theme.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[3],
      fontWeight: '600',
    },
    skillsList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
    },
    skillItem: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
    },
    skillBullet: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
    },
    skillText: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      margin: 0,
    },
  });

  const styles = getStyles();

  if (!skillCategories || skillCategories.length === 0) {
    return null;
  }

  return (
    <div style={styles.container} data-testid="skills-section">
      <h2 style={styles.title}>Skills & Technologies</h2>

      <div style={styles.skillsGrid}>
        {skillCategories.map((category, index) => (
          <div key={index} style={styles.categoryContainer}>
            <h3 style={styles.categoryTitle}>{category.title}</h3>
            <div style={styles.skillsList}>
              {category.skills.map((skill, idx) => (
                <div key={idx} style={styles.skillItem}>
                  <div
                    style={{
                      ...styles.skillBullet,
                      backgroundColor: category.color,
                    }}
                  />
                  <span style={styles.skillText}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};