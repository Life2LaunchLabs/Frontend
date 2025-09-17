import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { IconButton, Button } from '../../../shared/components';
import { useProfile, useUpdateProfile, useLogout } from '../../auth/api/hooks';
import type { User } from '../../auth/types';

function AccountPage() {
  const { theme, tokens } = useTheme();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    bio: '',
  });
  const [originalData, setOriginalData] = useState(formData);

  // Fetch user profile data
  const { data: user, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const logoutMutation = useLogout();

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      const userData = {
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: theme.surface,
      padding: tokens.spacing[6],
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing[8],
      paddingBottom: tokens.spacing[4],
      borderBottom: `1px solid ${theme.outline}`,
    },
    backButton: {
      marginRight: tokens.spacing[4],
    },
    title: {
      ...tokens.typography.headline.large,
      color: theme.onSurface,
      margin: 0,
      flex: 1,
    },
    content: {
      maxWidth: '600px',
      margin: '0 auto',
    },
    section: {
      backgroundColor: theme.surfaceContainer,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[6],
      marginBottom: tokens.spacing[6],
    },
    sectionTitle: {
      ...tokens.typography.headline.small,
      color: theme.onSurface,
      marginBottom: tokens.spacing[4],
    },
    formGroup: {
      marginBottom: tokens.spacing[5],
    },
    label: {
      ...tokens.typography.body.medium,
      color: theme.onSurface,
      display: 'block',
      marginBottom: tokens.spacing[2],
    },
    input: {
      width: '100%',
      padding: tokens.spacing[3],
      borderRadius: tokens.borderRadius.medium,
      border: `1px solid ${theme.outline}`,
      backgroundColor: theme.surface,
      color: theme.onSurface,
      fontFamily: tokens.typography.fontFamily.default.join(', '),
      fontSize: tokens.typography.body.large.fontSize,
      lineHeight: tokens.typography.body.large.lineHeight,
      boxSizing: 'border-box' as const,
    },
    textarea: {
      resize: 'vertical' as const,
      minHeight: '80px',
    },
    buttonGroup: {
      display: 'flex',
      gap: tokens.spacing[3],
      justifyContent: 'flex-end',
      marginTop: tokens.spacing[6],
    },
    dangerSection: {
      backgroundColor: theme.errorContainer,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[6],
    },
    dangerTitle: {
      ...tokens.typography.headline.small,
      color: theme.onErrorContainer,
      marginBottom: tokens.spacing[4],
    },
    dangerText: {
      ...tokens.typography.body.medium,
      color: theme.onErrorContainer,
      marginBottom: tokens.spacing[4],
    },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!isEditMode) return;

    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    try {
      const updateData: Partial<User> = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
      };

      await updateProfileMutation.mutateAsync(updateData);
      setOriginalData(formData);
      setIsEditMode(false);
    } catch {
      // Error handling is done in the mutation hook
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/login');
    } catch {
      // Error handling is done in the mutation hook
    }
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion with confirmation
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account');
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.surface,
        ...tokens.typography.body.large,
        color: theme.onSurface,
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={styles.backButton}>
            <IconButton
              icon="arrow_back"
              variant="standard"
              onClick={() => navigate('/home')}
            />
          </div>
          <h1 style={styles.title}>Account Settings</h1>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.section}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: tokens.spacing[4],
          }}>
            <h2 style={styles.sectionTitle}>Profile Information</h2>
            {!isEditMode && (
              <IconButton
                icon="edit"
                variant="outlined"
                onClick={handleEdit}
              />
            )}
          </div>


          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              style={{
                ...styles.input,
                backgroundColor: isEditMode ? theme.surface : theme.surfaceContainer,
                cursor: isEditMode ? 'text' : 'default',
              }}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              readOnly={!isEditMode}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="first_name">First Name</label>
            <input
              style={{
                ...styles.input,
                backgroundColor: isEditMode ? theme.surface : theme.surfaceContainer,
                cursor: isEditMode ? 'text' : 'default',
              }}
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              readOnly={!isEditMode}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="last_name">Last Name</label>
            <input
              style={{
                ...styles.input,
                backgroundColor: isEditMode ? theme.surface : theme.surfaceContainer,
                cursor: isEditMode ? 'text' : 'default',
              }}
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              readOnly={!isEditMode}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="bio">Bio</label>
            <textarea
              style={{
                ...styles.input,
                ...styles.textarea,
                backgroundColor: isEditMode ? theme.surface : theme.surfaceContainer,
                cursor: isEditMode ? 'text' : 'default',
              }}
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              readOnly={!isEditMode}
            />
          </div>

          {isEditMode && (
            <div style={styles.buttonGroup}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={updateProfileMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Account Actions</h2>
          <Button
            variant="outlined"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            style={{
              color: theme.primary,
              borderColor: theme.primary,
            }}
          >
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          </Button>
        </div>

        <div style={styles.dangerSection}>
          <h2 style={styles.dangerTitle}>Danger Zone</h2>
          <p style={styles.dangerText}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            variant="filled"
            onClick={handleDeleteAccount}
            style={{
              backgroundColor: theme.error,
              color: theme.onError,
            }}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;