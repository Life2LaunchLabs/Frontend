import React, { useState } from 'react';
import { useTheme } from '../../../../styles';
import { MediaBlockConfig, MediaAsset } from '../../types';

export interface MediaBlockProps {
  config: MediaBlockConfig;
  media: MediaAsset[];
}

export const MediaBlock: React.FC<MediaBlockProps> = ({ config, media }) => {
  const { colors, tokens } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Find the media asset for this block
  const mediaAsset = media.find(m => m.media_id === config.media_id);

  if (!mediaAsset) {
    return (
      <div style={{
        padding: tokens.spacing[4],
        backgroundColor: colors.errorContainer,
        color: colors.onErrorContainer,
        borderRadius: tokens.borderRadius.medium,
        textAlign: 'center',
        ...tokens.typography.body.medium
      }}>
        Media not found: {config.media_id}
      </div>
    );
  }

  const getMediaStyle = () => ({
    maxWidth: '100%',
    height: 'auto',
    borderRadius: tokens.borderRadius.medium,
    objectFit: config.fit || 'contain' as const,
    display: 'block',
    margin: '0 auto',
  });

  const getContainerStyle = () => ({
    marginBottom: tokens.spacing[4],
    textAlign: 'center' as const,
  });

  const getCaptionStyle = () => ({
    ...tokens.typography.body.small,
    color: colors.onSurfaceVariant,
    marginTop: tokens.spacing[2],
    fontStyle: 'italic',
  });

  const getLoadingStyle = () => ({
    width: '100%',
    height: '200px',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: tokens.borderRadius.medium,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.onSurfaceVariant,
    ...tokens.typography.body.medium
  });

  const renderMedia = () => {
    if (mediaAsset.mime_type.startsWith('image/')) {
      return (
        <img
          src={mediaAsset.url}
          alt={config.caption || 'Media content'}
          style={getMediaStyle()}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      );
    } else if (mediaAsset.mime_type.startsWith('video/')) {
      return (
        <video
          src={mediaAsset.url}
          controls
          style={getMediaStyle()}
          onLoadedData={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      );
    } else if (mediaAsset.mime_type.startsWith('audio/')) {
      return (
        <audio
          src={mediaAsset.url}
          controls
          style={{ width: '100%' }}
          onLoadedData={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      );
    } else {
      return (
        <div style={{
          ...getLoadingStyle(),
          backgroundColor: colors.surfaceContainerHighest,
        }}>
          Unsupported media type: {mediaAsset.mime_type}
        </div>
      );
    }
  };

  if (error) {
    return (
      <div style={getContainerStyle()}>
        <div style={{
          ...getLoadingStyle(),
          backgroundColor: colors.errorContainer,
          color: colors.onErrorContainer,
        }}>
          Failed to load media
        </div>
        {config.caption && (
          <div style={getCaptionStyle()}>{config.caption}</div>
        )}
      </div>
    );
  }

  return (
    <div style={getContainerStyle()}>
      {loading && (
        <div style={getLoadingStyle()}>
          Loading media...
        </div>
      )}
      <div style={{ display: loading ? 'none' : 'block' }}>
        {renderMedia()}
        {config.caption && (
          <div style={getCaptionStyle()}>{config.caption}</div>
        )}
      </div>
    </div>
  );
};