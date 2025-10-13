/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTheme } from '../../../styles';
import { PageLayout, Button } from '@shared/components';
import { useAdminStatus } from '../hooks';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { colors, tokens } = useTheme();
  const { adminStatus, loading } = useAdminStatus();

  const currentOrg = adminStatus?.default_organization;

  if (loading) {
    return (
      <PageLayout
        pageName="Dashboard"
        navMode="admin"
        verticalCenter
        panes={[
          {
            content: <p>Loading admin dashboard...</p>,
          },
        ]}
      />
    );
  }

  return (
    <PageLayout
      pageName="Dashboard"
      navMode="admin"
      panes={[
        {
          column: 'a',
          content: (
            <>
              {/* Header */}
              <div css={{ marginBottom: tokens.spacing[6] }}>
                <h1>Admin Dashboard</h1>
                <p>Welcome to the administration panel.</p>
                {currentOrg && (
                  <div css={{
                    color: colors.primary,
                    backgroundColor: colors.primaryContainer,
                    padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
                    borderRadius: tokens.borderRadius.small,
                    display: 'inline-block',
                    marginTop: tokens.spacing[3],
                  }}>
                    Current Organization: {currentOrg.name}
                  </div>
                )}
              </div>

              {/* Content */}
              <div css={{ textAlign: 'center', marginBottom: tokens.spacing[6] }}>
                <p>This is a placeholder for the admin dashboard. Here you'll be able to:</p>
                <div css={{ lineHeight: 1.8, marginTop: tokens.spacing[4] }}>
                  • Manage organization settings<br/>
                  • View user analytics<br/>
                  • Configure activities and quests<br/>
                  • Monitor system health<br/>
                  • Export data and reports
                </div>
              </div>

              {/* Actions */}
              <div css={{
                display: 'flex',
                gap: tokens.spacing[4],
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}>
                <Button variant="filled" onClick={() => navigate('/admin/quests')}>
                  Manage Quests
                </Button>
                <Button variant="outlined" onClick={() => navigate('/admin/select-org')}>
                  Switch Organization
                </Button>
                <Button variant="text" onClick={() => navigate('/')}>
                  Back to Home
                </Button>
              </div>
            </>
          ),
        },
      ]}
    />
  );
};