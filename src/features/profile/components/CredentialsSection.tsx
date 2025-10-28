/** @jsxImportSource @emotion/react */
import React from 'react';
import { Card, CardHeader, CardContent } from '@shared/components';
import { useTheme } from '@/styles';

export interface CredentialsSectionProps {
  asFragment?: boolean;
}

export const CredentialsSection: React.FC<CredentialsSectionProps> = ({ asFragment }) => {
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
    <Container {...(!asFragment ? { style: containerStyles, 'data-testid': 'credentials-section' } : {})}>
      <h2 style={titleStyles}>Credentials</h2>

      <div style={stackStyles}>
        <Card>
          <CardHeader>CPR Certification</CardHeader>
          <CardContent>
            American Red Cross CPR and First Aid Certification, valid through December 2026.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Google Analytics Certified</CardHeader>
          <CardContent>
            Google Analytics Individual Qualification (GAIQ) demonstrating proficiency in analytics tools.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Food Handler's Permit</CardHeader>
          <CardContent>
            State-certified food handler's permit, renewed annually with perfect safety record.
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};
