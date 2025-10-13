/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { PageLayout, Button } from '@shared/components';
import { ActivitiesService, ActivityResultsService } from '../api';
import { Activity } from '../types';

export const ActivityDetailPage: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { colors, tokens } = useTheme();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCompletions, setHasCompletions] = useState(false);

  useEffect(() => {
    const loadActivity = async () => {
      if (!activityId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await ActivitiesService.getActivity(activityId);
        setActivity(data);

        // Check if user has completed this activity
        const hasCompleted = await ActivityResultsService.hasCompletedActivity(activityId);
        setHasCompletions(hasCompleted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activity');
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [activityId]);

  const handleStart = () => {
    navigate(`/activities/active/${activityId}`);
  };

  const handleViewResults = () => {
    navigate(`/activities/results/${activityId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!activityId) {
    return (
      <PageLayout
        pageName="Activity Detail"
        layoutMode="utility"
        utilityHeader={{
          title: 'Activity',
          leftAction: { type: 'back', onClick: handleBack }
        }}
        panes={[
          {
            content: (
              <div css={{
                textAlign: 'center',
                padding: tokens.spacing[8],
              }}>
                <p css={{ color: colors.error }}>Activity not found</p>
              </div>
            ),
          },
        ]}
      />
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          ...tokens.typography.body.large,
          color: colors.onSurfaceVariant,
        }}>
          Loading activity...
        </div>
      );
    }

    if (error || !activity) {
      return (
        <div css={{
          textAlign: 'center',
          padding: tokens.spacing[8],
          backgroundColor: colors.errorContainer,
          color: colors.onErrorContainer,
          borderRadius: tokens.borderRadius.large,
          boxShadow: tokens.shadows.small,
        }}>
          <p css={{ ...tokens.typography.body.large, marginBottom: tokens.spacing[4] }}>
            {error || 'Activity not found'}
          </p>
          <Button variant="outlined" onClick={handleBack}>
            Go Back
          </Button>
        </div>
      );
    }

    const activityVersion = activity.activity_version;

    return (
      <div css={{
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing[6],
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {/* Header Card */}
        <div css={{
          backgroundColor: colors.surfaceVariant,
          borderRadius: tokens.borderRadius.large,
          padding: tokens.spacing[8],
          boxShadow: tokens.shadows.medium,
        }}>
          <h1 css={{
            ...tokens.typography.headline.large,
            color: colors.onSurface,
            marginBottom: tokens.spacing[4],
          }}>
            {activityVersion?.title || 'Untitled Activity'}
          </h1>

          {activityVersion?.description && (
            <p css={{
              ...tokens.typography.body.large,
              color: colors.onSurfaceVariant,
              marginBottom: tokens.spacing[6],
              lineHeight: 1.6,
            }}>
              {activityVersion.description}
            </p>
          )}

          {/* Status Badge */}
          {hasCompletions && (
            <div css={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: tokens.spacing[2],
              padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
              backgroundColor: colors.tertiaryContainer,
              color: colors.onTertiaryContainer,
              borderRadius: tokens.borderRadius.full,
              ...tokens.typography.label.medium,
              marginBottom: tokens.spacing[4],
            }}>
              <span css={{
                fontFamily: '"Material Symbols Outlined"',
                fontSize: '20px',
              }}>
                check_circle
              </span>
              Completed
            </div>
          )}

          {/* Metadata */}
          {activityVersion?.pages && (
            <div css={{
              display: 'flex',
              gap: tokens.spacing[4],
              marginTop: tokens.spacing[4],
              paddingTop: tokens.spacing[4],
              borderTop: `1px solid ${colors.outline}`,
            }}>
              <div css={{
                ...tokens.typography.body.small,
                color: colors.onSurfaceVariant,
              }}>
                <strong>{activityVersion.pages.length}</strong> {activityVersion.pages.length === 1 ? 'page' : 'pages'}
              </div>
            </div>
          )}
        </div>

        {/* Action Card */}
        <div css={{
          backgroundColor: colors.surfaceVariant,
          borderRadius: tokens.borderRadius.large,
          padding: tokens.spacing[8],
          boxShadow: tokens.shadows.small,
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing[4],
          alignItems: 'center',
        }}>
          <div css={{
            display: 'flex',
            gap: tokens.spacing[3],
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <Button
              variant="filled"
              onClick={handleStart}
              css={{
                minWidth: '200px',
                fontSize: tokens.typography.label.large.fontSize,
              }}
            >
              {hasCompletions ? 'Start Again' : 'Start Activity'}
            </Button>

            {hasCompletions && (
              <Button
                variant="outlined"
                onClick={handleViewResults}
                css={{
                  minWidth: '200px',
                  fontSize: tokens.typography.label.large.fontSize,
                }}
              >
                View Results
              </Button>
            )}
          </div>

          <p css={{
            ...tokens.typography.body.small,
            color: colors.onSurfaceVariant,
            textAlign: 'center',
          }}>
            Your progress will be saved automatically
          </p>
        </div>
      </div>
    );
  };

  return (
    <PageLayout
      pageName="Activity Detail"
      layoutMode="utility"
      utilityHeader={{
        title: activity?.activity_version?.title || 'Activity',
        leftAction: { type: 'back', onClick: handleBack }
      }}
      panes={[
        {
          content: renderContent(),
        },
      ]}
    />
  );
};
