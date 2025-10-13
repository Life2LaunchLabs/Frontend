import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../styles';
import { MediaBlockConfig } from '../../activities/types';
import { Button } from '../../../shared/components';

export interface EditableMediaBlockProps {
  config: MediaBlockConfig;
  onChange: (updatedConfig: MediaBlockConfig) => void;
}

export const EditableMediaBlock: React.FC<EditableMediaBlockProps> = ({
  config,
  onChange
}) => {
  const { colors, tokens } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const hasMedia = config.media_id && config.media_id.trim() !== '';

  // Fetch media URL when media_id changes
  useEffect(() => {
    const fetchMediaUrl = async () => {
      if (!hasMedia) {
        setMediaUrl(null);
        return;
      }

      setLoadingMedia(true);
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`http://localhost:8000/api/admin/media/${config.media_id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch media');
        }

        const mediaAsset = await response.json();
        setMediaUrl(mediaAsset.url);
      } catch (error) {
        console.error('Failed to fetch media URL:', error);
        setUploadError('Failed to load media');
      } finally {
        setLoadingMedia(false);
      }
    };

    fetchMediaUrl();
  }, [config.media_id, hasMedia]);

  const getStyles = () => ({
    container: {
      border: `2px dashed ${colors.outline}`,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[6],
      backgroundColor: colors.surfaceContainerLow,
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.spacing[4],
    },
    emptyState: {
      textAlign: 'center' as const,
      color: colors.onSurfaceVariant,
    },
    emptyIcon: {
      fontSize: '48px',
      color: colors.onSurfaceVariant,
      marginBottom: tokens.spacing[4],
    },
    emptyText: {
      ...tokens.typography.body.large,
      marginBottom: tokens.spacing[2],
    },
    emptySubtext: {
      ...tokens.typography.body.small,
      color: colors.onSurfaceVariant,
    },
    buttonGroup: {
      display: 'flex',
      gap: tokens.spacing[3],
      marginTop: tokens.spacing[4],
    },
    hiddenInput: {
      display: 'none',
    },
    errorText: {
      ...tokens.typography.body.small,
      color: colors.error,
      marginTop: tokens.spacing[2],
    },
    successText: {
      ...tokens.typography.body.small,
      color: colors.primary,
    },
    mediaPreview: {
      maxWidth: '100%',
      maxHeight: '400px',
      borderRadius: tokens.borderRadius.medium,
      objectFit: 'contain' as const,
      display: 'block',
      margin: '0 auto',
    },
    mediaContainer: {
      width: '100%',
      textAlign: 'center' as const,
    },
    mediaOverlay: {
      position: 'relative' as const,
    },
    loadingOverlay: {
      padding: tokens.spacing[8],
      color: colors.onSurfaceVariant,
      ...tokens.typography.body.medium,
    },
  });

  const styles = getStyles();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      formData.append('description', 'Uploaded from activity editor');

      // Get auth token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Upload to backend
      const response = await fetch('http://localhost:8000/api/admin/media/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const mediaAsset = await response.json();

      // Update config with new media_id
      onChange({
        ...config,
        media_id: mediaAsset.id,
      });

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    document.getElementById('media-file-input')?.click();
  };

  const handleSelectClick = () => {
    // TODO: Open media selection modal
    alert('Media selection modal coming soon!');
  };

  if (hasMedia) {
    return (
      <div style={{
        ...styles.container,
        borderStyle: 'solid',
        borderColor: colors.primary,
      }}>
        {loadingMedia ? (
          <div style={styles.loadingOverlay}>Loading media...</div>
        ) : mediaUrl ? (
          <div style={styles.mediaContainer}>
            <img
              src={mediaUrl}
              alt={config.caption || 'Media content'}
              style={styles.mediaPreview}
            />
            {config.caption && (
              <div style={{
                ...tokens.typography.body.small,
                color: colors.onSurfaceVariant,
                marginTop: tokens.spacing[2],
                fontStyle: 'italic',
              }}>
                {config.caption}
              </div>
            )}
          </div>
        ) : (
          <div style={styles.successText}>
            ✓ Media attached: {config.media_id}
          </div>
        )}
        <div style={styles.buttonGroup}>
          <Button
            variant="outlined"
            onClick={handleUploadClick}
            disabled={uploading || loadingMedia}
          >
            Replace
          </Button>
          <Button
            variant="outlined"
            onClick={() => onChange({ ...config, media_id: '' })}
            disabled={loadingMedia}
          >
            Remove
          </Button>
        </div>
        <input
          id="media-file-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={styles.hiddenInput}
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>🖼️</div>
        <div style={styles.emptyText}>No media attached</div>
        <div style={styles.emptySubtext}>
          Upload an image or select from existing media
        </div>

        {uploadError && (
          <div style={styles.errorText}>{uploadError}</div>
        )}

        <div style={styles.buttonGroup}>
          <Button
            variant="filled"
            onClick={handleUploadClick}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleSelectClick}
            disabled={uploading}
          >
            Select
          </Button>
        </div>
      </div>

      <input
        id="media-file-input"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={styles.hiddenInput}
      />
    </div>
  );
};
