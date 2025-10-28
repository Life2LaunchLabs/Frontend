/** @jsxImportSource @emotion/react */
import React from 'react';
import { Card, CardHeader, CardContent } from '@shared/components';
import { useTheme } from '@/styles';

export interface SoftSkillsSectionProps {
  asFragment?: boolean;
}

export const SoftSkillsSection: React.FC<SoftSkillsSectionProps> = ({ asFragment }) => {
  const { colors, tokens } = useTheme();

  const Container: React.ElementType = asFragment ? React.Fragment : 'div';

  const containerStyles = {
    backgroundColor: colors.surfaceContainer,
    borderColor: colors.outline,
    boxShadow: tokens.shadows.large,
    borderRadius: tokens.borderRadius.large,
    padding: tokens.spacing[8],
    border: `1px solid ${colors.outline}`,
    marginBottom: tokens.spacing[8],
  };

  const titleStyles = {
    ...tokens.typography.headline.medium,
    color: colors.onSurface,
    margin: 0,
    marginBottom: tokens.spacing[6],
    fontWeight: '700',
  };

  const stackStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: tokens.spacing[4],
  };

  return (
    <Container {...(!asFragment ? { style: containerStyles, 'data-testid': 'soft-skills-section' } : {})}>
      <h2 style={titleStyles}>Soft Skills</h2>

      <div style={stackStyles}>
        <Card>
          <CardHeader>Communication</CardHeader>
          <CardContent>
            Strong verbal and written communication skills developed through team projects and presentations.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Problem Solving</CardHeader>
          <CardContent>
            Analytical thinker with proven ability to identify issues and develop creative solutions.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Adaptability</CardHeader>
          <CardContent>
            Quick learner who thrives in dynamic environments and embraces new challenges.
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};
