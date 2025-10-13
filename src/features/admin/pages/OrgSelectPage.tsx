/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { PageLayout, Button } from '@shared/components';
import { useAdminStatus, useSetDefaultOrganization } from '../hooks';
import { Organization } from '../types';

export const OrgSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { tokens } = useTheme();
  const { adminStatus, loading: statusLoading } = useAdminStatus();
  const { setDefaultOrganization, loading: setDefaultLoading } = useSetDefaultOrganization();

  const [selectedOrgSlug, setSelectedOrgSlug] = useState<string>('');

  React.useEffect(() => {
    if (adminStatus?.default_organization) {
      setSelectedOrgSlug(adminStatus.default_organization.slug);
    } else if (adminStatus?.admin_organizations && adminStatus.admin_organizations.length > 0) {
      setSelectedOrgSlug(adminStatus.admin_organizations[0].slug);
    }
  }, [adminStatus]);

  const handleContinue = async () => {
    if (!selectedOrgSlug) return;

    const success = await setDefaultOrganization(selectedOrgSlug);
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  if (statusLoading) {
    return (
      <PageLayout
        pageName="Select Organization"
        verticalCenter
        navMode="admin"
        panes={[
          {
            content: <p>Loading admin status...</p>,
          },
        ]}
      />
    );
  }

  if (!adminStatus?.is_admin || !adminStatus.admin_organizations.length) {
    return (
      <PageLayout
        pageName="Select Organization"
        verticalCenter
        navMode="admin"
        panes={[
          {
            content: (
              <>
                <div css={{ textAlign: 'center', marginBottom: tokens.spacing[6] }}>
                  <h2>Access Denied</h2>
                  <p>You don't have admin access to any organizations.</p>
                </div>
                <Button variant="outlined" onClick={() => navigate('/')} css={{ width: '100%' }}>
                  Go Home
                </Button>
              </>
            ),
          },
        ]}
      />
    );
  }

  return (
    <PageLayout
      pageName="Select Organization"
      verticalCenter
      navMode="admin"
      layoutMode='auth'
      gridParams={{cols: [{ id:'a', width: `minmax(${tokens.paneWidths.large}, ${tokens.paneWidths.large})`}]}}

      panes={[
        {
          content: (
            <>
              {/* Header */}
              <div css={{ textAlign: 'center', marginBottom: tokens.spacing[6] }}>
                <h2>Select Organization</h2>
                <p>Choose which organization you'd like to administer</p>
              </div>

              {/* Form */}
              <div css={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[4], marginBottom: tokens.spacing[6] }}>
                <label htmlFor="organization-select">
                  Organization:
                </label>
                <select
                  id="organization-select"
                  value={selectedOrgSlug}
                  onChange={(e) => setSelectedOrgSlug(e.target.value)}
                  css={{
                    width: '100%',
                    padding: tokens.spacing[4],
                    fontSize: '16px', // Prevent zoom on mobile
                  }}
                >
                  {adminStatus.admin_organizations.map((org: Organization) => (
                    <option key={org.id} value={org.slug}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="filled"
                onClick={handleContinue}
                disabled={!selectedOrgSlug || setDefaultLoading}
                css={{ width: '100%' }}
              >
                {setDefaultLoading ? 'Loading...' : 'Continue'}
              </Button>
            </>
          ),
        },
      ]}
    />
  );
};