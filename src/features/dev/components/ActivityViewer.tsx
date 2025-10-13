import React, { useState } from 'react';
import { useTheme } from '../../../styles';
import { useActivityPage, BlockRenderer } from '../../activities';

export interface ActivityViewerProps {
  slug: string;
  onResponseChange?: (questionId: string, value: any) => void;
}

export const ActivityViewer: React.FC<ActivityViewerProps> = ({
  slug,
  onResponseChange
}) => {
  const { theme, tokens } = useTheme();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const { pageData, loading, error } = useActivityPage(slug, currentPageIndex);

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    onResponseChange?.(questionId, value);
  };

  const getContainerStyle = () => ({
    maxWidth: '800px',
    margin: '0 auto',
    padding: tokens.spacing[6],
    backgroundColor: theme.surface,
    minHeight: '100vh',
  });

  const getHeaderStyle = () => ({
    marginBottom: tokens.spacing[8],
    textAlign: 'center' as const,
  });

  const getTitleStyle = () => ({
    ...tokens.typography.display.medium,
    color: theme.onSurface,
    margin: 0,
    marginBottom: tokens.spacing[2],
  });

  const getPageTitleStyle = () => ({
    ...tokens.typography.headline.large,
    color: theme.onSurfaceVariant,
    margin: 0,
    marginBottom: tokens.spacing[4],
  });

  const getProgressStyle = () => ({
    ...tokens.typography.body.small,
    color: theme.onSurfaceVariant,
    backgroundColor: theme.surfaceContainerLow,
    padding: `${tokens.spacing[1]}px ${tokens.spacing[3]}px`,
    borderRadius: tokens.borderRadius.full,
    display: 'inline-block',
  });

  const getContentStyle = () => ({
    marginBottom: tokens.spacing[8],
  });

  const getNavigationStyle = () => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: tokens.spacing[6],
    borderTop: `1px solid ${theme.outline}`,
  });

  const getButtonStyle = (variant: 'primary' | 'secondary' = 'primary') => ({
    backgroundColor: variant === 'primary' ? theme.primary : theme.surfaceContainerHighest,
    color: variant === 'primary' ? theme.onPrimary : theme.onSurface,
    border: variant === 'secondary' ? `1px solid ${theme.outline}` : 'none',
    borderRadius: tokens.borderRadius.medium,
    padding: `${tokens.spacing[3]}px ${tokens.spacing[6]}px`,
    fontSize: tokens.typography.body.medium.fontSize,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const getLoadingStyle = () => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    ...tokens.typography.body.large,
    color: theme.onSurfaceVariant,
  });

  const getErrorStyle = () => ({
    padding: tokens.spacing[6],
    backgroundColor: theme.errorContainer,
    color: theme.onErrorContainer,
    borderRadius: tokens.borderRadius.medium,
    textAlign: 'center' as const,
    ...tokens.typography.body.medium,
  });

  if (loading) {
    return (
      <div style={getContainerStyle()}>
        <div style={getLoadingStyle()}>
          Loading activity...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={getContainerStyle()}>
        <div style={getErrorStyle()}>
          Error loading activity: {error}
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div style={getContainerStyle()}>
        <div style={getErrorStyle()}>
          No activity data found
        </div>
      </div>
    );
  }

  const { activity_version, page, blocks, media } = pageData;

  return (
    <div style={getContainerStyle()}>
      {/* Header */}
      <div style={getHeaderStyle()}>
        <h1 style={getTitleStyle()}>{activity_version.title}</h1>
        {page.title && (
          <h2 style={getPageTitleStyle()}>{page.title}</h2>
        )}
        <div style={getProgressStyle()}>
          Page {page.index + 1}
        </div>
      </div>

      {/* Content */}
      <div style={getContentStyle()}>
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            media={media}
            onResponseChange={handleResponseChange}
            responses={responses}
          />
        ))}
      </div>

      {/* Navigation */}
      <div style={getNavigationStyle()}>
        <button
          style={getButtonStyle('secondary')}
          onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
          disabled={currentPageIndex === 0}
        >
          ← Previous
        </button>

        <div style={{
          ...tokens.typography.body.medium,
          color: theme.onSurfaceVariant,
        }}>
          Page {currentPageIndex + 1}
        </div>

        <button
          style={getButtonStyle('primary')}
          onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
        >
          Next →
        </button>
      </div>

      {/* Debug: Show responses */}
      {Object.keys(responses).length > 0 && (
        <div style={{
          marginTop: tokens.spacing[6],
          padding: tokens.spacing[4],
          backgroundColor: theme.surfaceContainerLow,
          borderRadius: tokens.borderRadius.medium,
          border: `1px solid ${theme.outline}`,
        }}>
          <h3 style={{
            ...tokens.typography.body.medium,
            margin: 0,
            marginBottom: tokens.spacing[2],
            color: theme.onSurface,
          }}>
            Debug: Current Responses
          </h3>
          <pre style={{
            ...tokens.typography.body.small,
            color: theme.onSurfaceVariant,
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}>
            {JSON.stringify(responses, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};