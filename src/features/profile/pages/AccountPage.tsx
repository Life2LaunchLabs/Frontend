/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { PageLayout } from '@shared/components'; 
import { IconButton, Button } from '../../../shared/components';
import { useTheme } from '../../../styles';
import { useProfile, useUpdateProfile, useLogout } from '../../auth/api/hooks';
import type { User } from '../../auth/types';

const fieldCss = (tokens: any, colors: any, editable: boolean) => css({
  width: '100%',
  padding: tokens.spacing[3],
  borderRadius: tokens.borderRadius.medium,
  border: `1px solid ${colors.outline}`,
  backgroundColor: editable ? colors.surface : colors.surfaceContainer,
  color: colors.onSurface,
  fontFamily: tokens.typography.fontFamily.default,
  fontSize: tokens.typography.body.large.fontSize,
  lineHeight: tokens.typography.body.large.lineHeight,
  boxSizing: 'border-box',
  cursor: editable ? 'text' : 'default',
  ':focus': {
    outline: 'none',
    borderColor: colors.primary,
    boxShadow: `0 0 0 3px ${colors.primary}22`,
  },
});

export default function AccountPage() {
  const { colors, tokens } = useTheme();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    bio: '',
  });
  const [originalData, setOriginalData] = useState(formData);

  const { data: user, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const logout = useLogout();

  // populate form
  useEffect(() => {
    if (user) {
      const u = {
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
      };
      setFormData(u);
      setOriginalData(u);
    }
  }, [user]);

  const isSaving = !!updateProfile.isPending;
  const isLoggingOut = !!logout.isPending;

  const hasChanges = useMemo(() => {
    return (
      formData.email !== originalData.email ||
      formData.first_name !== originalData.first_name ||
      formData.last_name !== originalData.last_name ||
      formData.bio !== originalData.bio
    );
  }, [formData, originalData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!isEditMode) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setIsEditMode(true);

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    if (isSaving) return;
    try {
      const updateData: Partial<User> = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
      };
      await updateProfile.mutateAsync(updateData);
      setOriginalData(formData);
      setIsEditMode(false);
    } catch {
      // error surfaced by hook
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      await logout.mutateAsync();
      navigate('/login');
    } catch {
      // error surfaced by hook
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account');
    }
  };

  // ——— Utility header config ———
  const utilityHeader = {
    leftAction: { type: 'back' as const, label: 'Back' },
    rightAction: {
      label: isEditMode ? (isSaving ? 'Saving…' : 'Save') : 'Done',
      onClick: isEditMode ? handleSave : () => navigate(-1),
    },
  };

  if (isLoading) {
    return (
      <PageLayout
        pageName="Account Settings"
        layoutMode="utility"
        utilityHeader={utilityHeader}
        panes={[
          {
            content: (
              <div
                css={{
                  minHeight: '40vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...tokens.typography.body.large,
                  color: colors.onSurface,
                }}
              >
                Loading…
              </div>
            ),
          },
        ]}
      />
    );
  }

  // ——— Section blocks ———

  const sectionTitle = css({
    ...tokens.typography.headline.small,
    color: colors.onSurface,
    marginBottom: tokens.spacing[4],
  });

  const formGroup = css({
    marginBottom: tokens.spacing[5],
  });

  const labelCss = css({
    ...tokens.typography.body.medium,
    color: colors.onSurface,
    display: 'block',
    marginBottom: tokens.spacing[2],
  });

  const buttonRow = css({
    display: 'flex',
    gap: tokens.spacing[3],
    justifyContent: 'flex-end',
    marginTop: tokens.spacing[6],
  });

  const dangerTitle = css({
    ...tokens.typography.headline.small,
    color: colors.onErrorContainer,
    marginBottom: tokens.spacing[4],
  });

  const dangerText = css({
    ...tokens.typography.body.medium,
    color: colors.onErrorContainer,
    marginBottom: tokens.spacing[4],
  });

  // ——— Page content via panes ———
  return (
    <PageLayout
      pageName="Account Settings"
      layoutMode="utility"
      utilityHeader={utilityHeader}
      panes={[
        {
          content: (
            <>
              <div
                css={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: tokens.spacing[4],
                }}
              >
                <h2 css={sectionTitle}>Profile Information</h2>
                {!isEditMode && (
                  <IconButton icon="edit" variant="outlined" onClick={handleEdit} />
                )}
              </div>

              <div css={formGroup}>
                <label css={labelCss} htmlFor="email">Email</label>
                <input
                  css={fieldCss(tokens, colors, isEditMode)}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  readOnly={!isEditMode}
                />
              </div>

              <div css={formGroup}>
                <label css={labelCss} htmlFor="first_name">First Name</label>
                <input
                  css={fieldCss(tokens, colors, isEditMode)}
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  readOnly={!isEditMode}
                />
              </div>

              <div css={formGroup}>
                <label css={labelCss} htmlFor="last_name">Last Name</label>
                <input
                  css={fieldCss(tokens, colors, isEditMode)}
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  readOnly={!isEditMode}
                />
              </div>

              <div css={formGroup}>
                <label css={labelCss} htmlFor="bio">Bio</label>
                <textarea
                  css={[
                    fieldCss(tokens, colors, isEditMode),
                    { resize: 'vertical' as const, minHeight: 96 },
                  ]}
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  readOnly={!isEditMode}
                />
              </div>

              {isEditMode && (
                <div css={buttonRow}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="filled"
                    onClick={handleSave}
                    disabled={isSaving || !hasChanges}
                  >
                    {isSaving ? 'Saving…' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </>
          ),
        },
        {
          content: (
            <>
              <h2 css={sectionTitle}>Account Actions</h2>
              <Button
                variant="outlined"
                onClick={handleLogout}
                disabled={isLoggingOut}
                style={{ color: colors.primary, borderColor: colors.primary }}
              >
                {isLoggingOut ? 'Logging out…' : 'Logout'}
              </Button>
            </>
          ),
        },
        {
          content: (
            <>
              <h2 css={dangerTitle}>Danger Zone</h2>
              <p css={dangerText}>
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button
                variant="filled"
                onClick={handleDeleteAccount}
                style={{ backgroundColor: colors.error, color: colors.onError }}
              >
                Delete Account
              </Button>
            </>
          ),
        },
      ]}
    />
  );
}
