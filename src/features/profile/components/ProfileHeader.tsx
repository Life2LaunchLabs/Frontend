import React from 'react';
import { useTheme } from '../../../styles';
import { useProfileData } from '../api/hooks';
import defaultProfilePhoto from '../../../shared/assets/images/default_profile_photo.png';
import { Icon } from '../../../shared/components';

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

  const Container: React.ElementType = asFragment ? React.Fragment : 'div';

  // Use backend data if available, fallback to props
  const fullName = profileData?.full_name || profileData?.first_name && profileData?.last_name
    ? `${profileData.first_name} ${profileData.last_name}`.trim()
    : defaultFullName || '';
  const tagline = profileData?.tagline || ''; // Tagline from backend
  const bio = profileData?.bio || '';
  const email = profileData?.email || '';
  const profilePhotoUrl = profileData?.profile_photo_url || defaultProfilePhotoUrl || '';


  const getStyles = () => ({
    container: {
      backgroundColor: colors.surfaceContainer,
      borderColor: colors.outline,
      boxShadow: tokens.shadows.large,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[8],
      border: `1px solid ${colors.outline}`,
      marginBottom: tokens.spacing[8],
    },
    content: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: tokens.spacing[6],
    },
    photoContainer: {
      flexShrink: 0,
    },
    photo: {
      width: '128px',
      height: '128px',
      borderRadius: tokens.borderRadius.large,
      overflow: 'hidden',
      border: `4px solid ${colors.onSurface}`,
      boxShadow: tokens.shadows.large,
    },
    photoImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    leftColumn: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
    },
    rightColumn: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-start',
      gap: tokens.spacing[2],
      paddingTop: tokens.spacing[2],
    },
    name: {
      ...tokens.typography.title.large,
      color: colors.onSurface,
      margin: 0,
      fontSize: '2rem',
      fontWeight: '700',
    },
    tagline: {
      ...tokens.typography.title.medium,
      color: colors.onSurface,
      margin: 0,
      fontWeight: '500',
    },
    bio: {
      ...tokens.typography.body.small,
      color: colors.onSurfaceVariant,
      lineHeight: '1.6',
      marginTop: tokens.spacing[2],
    },
    emailContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
    },
    emailIcon: {
      color: colors.onSurface,
      fontSize: '1.2rem',
    },
    emailText: {
      ...tokens.typography.body.medium,
      color: colors.onSurfaceVariant,
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
      <div style={styles.content}>
        <div style={styles.photoContainer}>
          <div style={styles.photo}>
            <img
              src={profilePhotoUrl || defaultProfilePhoto}
              alt={`${fullName}'s profile`}
              style={styles.photoImg}
              onError={(e) => {
                e.currentTarget.src = defaultProfilePhoto;
              }}
            />
          </div>
        </div>

        <div style={styles.leftColumn}>
          {fullName && <h1 style={styles.name}>{fullName}</h1>}
          {tagline && <p style={styles.tagline}>{tagline}</p>}
          {bio && <p style={styles.bio}>{bio}</p>}
        </div>

        <div style={styles.rightColumn}>
          {email && (
            <div style={styles.emailContainer}>
              <Icon name="mail" size={20} color="surface" />
              <span style={styles.emailText}>{email}</span>
            </div>
          )}
          <div style={styles.emailContainer}>
            <Icon name="instagram" size={20} color="surface" />
            <a href="https://instagram.com/username" style={styles.emailText} target="_blank" rel="noopener noreferrer">@username</a>
          </div>
          <div style={styles.emailContainer}>
            <Icon name="twitter" size={20} color="surface" />
            <a href="https://twitter.com/username" style={styles.emailText} target="_blank" rel="noopener noreferrer">@username</a>
          </div>
          <div style={styles.emailContainer}>
            <Icon name="globe" size={20} color="surface" />
            <a href="https://portfolio.example.com" style={styles.emailText} target="_blank" rel="noopener noreferrer">portfolio.example.com</a>
          </div>
        </div>
      </div>
    </Container>
  );
};