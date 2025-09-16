import React from 'react';
import { useTheme } from '../../../styles';

export interface ProfileHeaderProps {
  fullName: string;
  title: string;
  bio?: string;
  email?: string;
  location: string;
  linkedinUrl?: string;
  profilePhotoUrl?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  title,
  bio,
  email,
  location,
  linkedinUrl,
  profilePhotoUrl
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
      border: `4px solid ${theme.primary}`,
      boxShadow: tokens.shadows.lg,
      transition: 'transform 0.3s ease',
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
      color: theme.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[2],
      fontSize: '2rem',
      fontWeight: '700',
    },
    titleText: {
      ...tokens.typography.headline.small,
      color: theme.primary,
      margin: 0,
      marginBottom: tokens.spacing[4],
      fontWeight: '500',
    },
    bio: {
      ...tokens.typography.body.large,
      color: theme.onSurfaceVariant,
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
      color: theme.primary,
      fontSize: '1.2rem',
    },
    contactText: {
      color: theme.onSurfaceVariant,
      textDecoration: 'none',
    },
    contactLink: {
      color: theme.primary,
      textDecoration: 'none',
    },
  });

  const styles = getStyles();

  const defaultProfilePhoto = 'https://via.placeholder.com/128x128/cccccc/666666?text=Profile';

  return (
    <div style={styles.container} data-testid="profile-header">
      <div style={styles.content}>
        <div style={styles.photoContainer}>
          <div
            style={styles.photo}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
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

        <div style={styles.infoContainer}>
          <h1 style={styles.name}>{fullName}</h1>
          <p style={styles.titleText}>{title}</p>

          {bio && (
            <p style={styles.bio}>{bio}</p>
          )}

          <div style={styles.contactInfo}>
            {email && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>✉</span>
                <span style={styles.contactText}>{email}</span>
              </div>
            )}
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📍</span>
              <span style={styles.contactText}>{location}</span>
            </div>
            {linkedinUrl && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>🔗</span>
                <a
                  href={linkedinUrl}
                  style={styles.contactLink}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};