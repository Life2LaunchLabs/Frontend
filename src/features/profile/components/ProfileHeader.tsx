import React, { useState } from 'react';
import { useTheme } from '../../../styles';
import { IconButton } from '../../../shared/components';
import { useProfileData, useUpdateProfileData } from '../api/hooks';
import type { ProfileHeaderEditData } from '../types';
import defaultProfilePhoto from '../../../shared/assets/images/default_profile_photo.png';

export interface ProfileHeaderProps {
  // Props are now optional since we fetch from backend
  fullName?: string;
  profilePhotoUrl?: string;
  asFragment?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  // Default props are now optional fallbacks
  fullName: defaultFullName,
  profilePhotoUrl: defaultProfilePhotoUrl,
  asFragment
}) => {
  const { colors, tokens } = useTheme();
  const { data: profileData, isLoading, error } = useProfileData();
  const updateProfileMutation = useUpdateProfileData();

  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<ProfileHeaderEditData>({});
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const Container: React.ElementType = asFragment ? React.Fragment : 'div';

  // Use backend data if available, fallback to props
  const fullName = profileData?.full_name || profileData?.first_name && profileData?.last_name
    ? `${profileData.first_name} ${profileData.last_name}`.trim()
    : defaultFullName || '';
  const tagline = profileData?.tagline || ''; // Tagline from backend
  const bio = profileData?.bio || '';
  const email = profileData?.email || '';
  const profilePhotoUrl = profileData?.profile_photo_url || defaultProfilePhotoUrl || '';

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit mode
      setEditData({});
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setIsEditMode(false);
    } else {
      // Enter edit mode
      setEditData({
        first_name: profileData?.first_name || '',
        last_name: profileData?.last_name || '',
        bio: profileData?.bio || '',
        email: profileData?.email || '',
        tagline: profileData?.tagline || '',
      });
      setIsEditMode(true);
    }
  };

  const handleSave = async () => {
    try {
      const updateData = { ...editData };
      if (selectedPhoto) {
        updateData.profile_photo = selectedPhoto;
      }
      await updateProfileMutation.mutateAsync(updateData);
      setIsEditMode(false);
      setEditData({});
      setSelectedPhoto(null);
      setPhotoPreview(null);
    } catch (error) {
      // Error is handled by the mutation hook with toast
    }
  };

  const handleInputChange = (field: keyof ProfileHeaderEditData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setSelectedPhoto(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    if (isEditMode) {
      document.getElementById('photo-upload-input')?.click();
    }
  };

  const getStyles = () => ({
    container: {
      backgroundColor: colors.surfaceContainer,
      borderColor: colors.outline,
      boxShadow: tokens.shadows.large,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[8],
      border: `1px solid ${colors.outline}`,
      marginBottom: tokens.spacing[8],
      position: 'relative' as const,
    },
    editButton: {
      position: 'absolute' as const,
      top: tokens.spacing[4],
      right: tokens.spacing[4],
    },
    saveButton: {
      position: 'absolute' as const,
      top: tokens.spacing[4],
      right: tokens.spacing[12], // Make room for cancel button
    },
    cancelButton: {
      position: 'absolute' as const,
      top: tokens.spacing[4],
      right: tokens.spacing[4],
    },
    content: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: tokens.spacing[6],
    },
    photoContainer: {
      flexShrink: 0,
      position: 'relative' as const,
    },
    photo: {
      width: '128px',
      height: '128px',
      borderRadius: tokens.borderRadius.large,
      overflow: 'hidden',
      border: `4px solid ${colors.primary}`,
      boxShadow: tokens.shadows.large,
      transition: 'transform 0.3s ease',
      cursor: isEditMode ? 'pointer' : 'default',
    },
    photoUploadOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: tokens.borderRadius.large,
      opacity: 0,
      transition: 'opacity 0.3s ease',
      color: 'white',
      fontSize: '0.875rem',
      fontWeight: '500',
      textAlign: 'center' as const,
    },
    hiddenInput: {
      display: 'none',
    },
    photoImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    infoContainer: {
      flex: 1,
    },
    name: {
      ...tokens.typography.headline.large,
      color: colors.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[2],
      fontSize: '2rem',
      fontWeight: '700',
    },
    titleText: {
      ...tokens.typography.headline.small,
      color: colors.primary,
      margin: 0,
      marginBottom: tokens.spacing[4],
      fontWeight: '500',
    },
    bio: {
      ...tokens.typography.body.large,
      color: colors.onSurfaceVariant,
      lineHeight: '1.6',
      marginBottom: tokens.spacing[6],
    },
    contactInfo: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: tokens.spacing[6],
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
    },
    contactIcon: {
      color: colors.primary,
      fontSize: '1.2rem',
    },
    contactText: {
      color: colors.onSurfaceVariant,
      textDecoration: 'none',
    },
    contactLink: {
      color: colors.primary,
      textDecoration: 'none',
    },
    input: {
      width: '100%',
      padding: tokens.spacing[2],
      border: `1px solid ${colors.outline}`,
      borderRadius: tokens.borderRadius.medium,
      backgroundColor: colors.surface,
      color: colors.onSurface,
      fontSize: 'inherit',
      fontFamily: 'inherit',
    },
    textarea: {
      width: '100%',
      padding: tokens.spacing[2],
      border: `1px solid ${colors.outline}`,
      borderRadius: tokens.borderRadius.medium,
      backgroundColor: colors.surface,
      color: colors.onSurface,
      fontSize: 'inherit',
      fontFamily: 'inherit',
      minHeight: '80px',
      resize: 'vertical' as const,
    },
    loadingState: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      color: colors.onSurfaceVariant,
    },
    errorState: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      color: colors.error,
    },
  });

  const styles = getStyles();

  // Use local default profile photo instead of external placeholder

  if (isLoading) {
    return (
      <div style={styles.container} data-testid="profile-header">
        <div style={styles.loadingState}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container} data-testid="profile-header">
        <div style={styles.errorState}>
          Failed to load profile data
        </div>
      </div>
    );
  }

  return (
    <Container {...(!asFragment ? { style: styles.container, 'data-testid': 'profile-header' } : {})}>
      {/* Edit Controls */}
      {!isEditMode ? (
        <div style={styles.editButton}>
          <IconButton
            icon="edit"
            variant="standard"
            onClick={handleEditToggle}
            disabled={updateProfileMutation.isPending}
          />
        </div>
      ) : (
        <>
          <div style={styles.saveButton}>
            <IconButton
              icon="check"
              variant="filled"
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
            />
          </div>
          <div style={styles.cancelButton}>
            <IconButton
              icon="close"
              variant="outlined"
              onClick={handleEditToggle}
              disabled={updateProfileMutation.isPending}
            />
          </div>
        </>
      )}

      <div style={styles.content}>
        <div style={styles.photoContainer}>
          <div
            style={styles.photo}
            onClick={handlePhotoClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              if (isEditMode) {
                const overlay = e.currentTarget.querySelector('.photo-upload-overlay') as HTMLElement;
                if (overlay) overlay.style.opacity = '1';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              if (isEditMode) {
                const overlay = e.currentTarget.querySelector('.photo-upload-overlay') as HTMLElement;
                if (overlay) overlay.style.opacity = '0';
              }
            }}
          >
            <img
              src={photoPreview || profilePhotoUrl || defaultProfilePhoto}
              alt={`${fullName}'s profile`}
              style={styles.photoImg}
              onError={(e) => {
                if (!photoPreview) {
                  e.currentTarget.src = defaultProfilePhoto;
                }
              }}
            />
            {isEditMode && (
              <div className="photo-upload-overlay" style={styles.photoUploadOverlay}>
                📸<br />Click to<br />change photo
              </div>
            )}
          </div>
          <input
            id="photo-upload-input"
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            style={styles.hiddenInput}
          />
        </div>

        <div style={styles.infoContainer}>
          {/* Name */}
          {isEditMode ? (
            <div style={{ display: 'flex', gap: tokens.spacing[2], marginBottom: tokens.spacing[2] }}>
              <input
                type="text"
                placeholder="First name"
                value={editData.first_name || ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Last name"
                value={editData.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                style={styles.input}
              />
            </div>
          ) : (
            fullName && <h1 style={styles.name}>{fullName}</h1>
          )}

          {/* Tagline */}
          {isEditMode ? (
            <input
              type="text"
              placeholder="Your professional tagline..."
              value={editData.tagline || ''}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
              style={styles.input}
            />
          ) : (
            tagline && <p style={styles.titleText}>{tagline}</p>
          )}

          {/* Bio */}
          {isEditMode ? (
            <textarea
              placeholder="Tell us about yourself..."
              value={editData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              style={styles.textarea}
            />
          ) : (
            bio && <p style={styles.bio}>{bio}</p>
          )}

          <div style={styles.contactInfo}>
            {/* Email */}
            {isEditMode ? (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>✉</span>
                <input
                  type="email"
                  placeholder="Email address"
                  value={editData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={styles.input}
                />
              </div>
            ) : (
              email && (
                <div style={styles.contactItem}>
                  <span style={styles.contactIcon}>✉</span>
                  <span style={styles.contactText}>{email}</span>
                </div>
              )
            )}

            {/* Location and LinkedIn removed */}
          </div>
        </div>
      </div>
    </Container>
  );
};