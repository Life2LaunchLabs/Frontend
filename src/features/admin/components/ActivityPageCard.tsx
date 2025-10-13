import React from 'react';
import { useTheme } from '../../../styles';
import { Page, Block, MediaAsset } from '../../activities/types';

interface ActivityPageCardProps {
  page: Page;
  blocks: Block[];
  media: MediaAsset[];
  pageNumber: number;
}

export const ActivityPageCard: React.FC<ActivityPageCardProps> = ({
  page,
  blocks,
  media,
  pageNumber,
}) => {
  const { colors, tokens } = useTheme();

  const getStyles = () => ({
    card: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[6],
      marginBottom: tokens.spacing[6],
      boxShadow: tokens.shadows.medium,
      border: `1px solid ${colors.outline}`,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing[6],
      paddingBottom: tokens.spacing[4],
      borderBottom: `1px solid ${colors.outline}`,
    },
    pageNumber: {
      ...tokens.typography.label.large,
      color: colors.primary,
      backgroundColor: colors.primaryContainer,
      padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
      borderRadius: tokens.borderRadius.medium,
    },
    pageTitle: {
      ...tokens.typography.headline.medium,
      color: colors.onSurface,
    },
    pageIndex: {
      ...tokens.typography.body.small,
      color: colors.onSurfaceVariant,
    },
    blocksContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
    },
    blockCard: {
      backgroundColor: colors.surface,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[4],
      border: `1px solid ${colors.outline}`,
    },
    blockHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing[3],
    },
    blockType: {
      ...tokens.typography.label.small,
      color: colors.secondary,
      backgroundColor: colors.secondaryContainer,
      padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
      borderRadius: tokens.borderRadius.small,
      textTransform: 'uppercase' as const,
    },
    blockContent: {
      ...tokens.typography.body.medium,
      color: colors.onSurface,
      whiteSpace: 'pre-wrap' as const,
    },
    mediaImage: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: tokens.borderRadius.medium,
      marginTop: tokens.spacing[2],
    },
    questionContainer: {
      backgroundColor: colors.primaryContainer,
      padding: tokens.spacing[3],
      borderRadius: tokens.borderRadius.small,
      marginTop: tokens.spacing[2],
    },
    questionTitle: {
      ...tokens.typography.body.large,
      color: colors.onPrimaryContainer,
      fontWeight: '500',
      marginBottom: tokens.spacing[2],
    },
    questionSubtitle: {
      ...tokens.typography.body.small,
      color: colors.onPrimaryContainer,
      opacity: 0.8,
    },
  });

  const styles = getStyles();

  const getMediaById = (mediaId: string): MediaAsset | undefined => {
    return media.find(m => m.media_id === mediaId);
  };

  const renderQuestionSummary = (block: Block) => {
    const questionConfig = block.config || {};
    const displayType = questionConfig.question_type || block.block_type;
    const nestedConfig = questionConfig.config || {};
    const options = questionConfig.options || nestedConfig.options || [];
    const prompts = questionConfig.prompts || nestedConfig.prompts || [];

    return (
      <div style={styles.questionContainer}>
        <div style={styles.questionTitle}>
          {questionConfig.title || questionConfig.question_text || 'Question'}
        </div>
        {questionConfig.subtitle && (
          <div style={styles.questionSubtitle}>
            {questionConfig.subtitle}
          </div>
        )}
        <div style={{ ...styles.blockContent, marginTop: tokens.spacing[2], fontSize: '14px' }}>
          Type: {displayType || 'Unknown'}{questionConfig.required && ' (Required)'}
        </div>
        {['multiple_choice', 'single_choice', 'dropdown_input'].includes(displayType) && options.length > 0 && (
          <div style={{ ...styles.blockContent, marginTop: tokens.spacing[2], fontSize: '12px' }}>
            Options: {options.map((opt: any) => opt.title || opt.label).join(', ')}
          </div>
        )}
        {displayType === 'a_or_b_input' && prompts.length > 0 && (
          <div style={{ ...styles.blockContent, marginTop: tokens.spacing[2], fontSize: '12px' }}>
            Prompts: {prompts.map((prompt: any) => prompt.title).join(', ')}
          </div>
        )}
      </div>
    );
  };

  const renderBlockContent = (block: Block) => {
    switch (block.block_type) {
      case 'text':
        return (
          <div style={styles.blockContent}>
            {block.config.text || block.config.content || 'No text content'}
          </div>
        );

      case 'media':
        const mediaAsset = getMediaById(block.config.media_id);
        return (
          <div>
            {mediaAsset && (
              <img
                src={mediaAsset.url}
                alt={block.config.caption || 'Media content'}
                style={styles.mediaImage}
              />
            )}
            {block.config.caption && (
              <div style={{ ...styles.blockContent, fontSize: '14px', fontStyle: 'italic', marginTop: tokens.spacing[2] }}>
                {block.config.caption}
              </div>
            )}
          </div>
        );

      case 'question':
      case 'text_input':
      case 'multiple_choice':
      case 'dropdown_input':
      case 'a_or_b_input':
        return renderQuestionSummary(block);

      default:
        return (
          <div style={styles.blockContent}>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(block.config, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.pageTitle}>
            {page.title || `Page ${page.index + 1}`}
          </h3>
          <div style={styles.pageIndex}>
            Index: {page.index}
          </div>
        </div>
        <div style={styles.pageNumber}>
          Page {pageNumber}
        </div>
      </div>

      <div style={styles.blocksContainer}>
        {blocks.length === 0 ? (
          <div style={{ ...styles.blockContent, fontStyle: 'italic', color: colors.onSurfaceVariant }}>
            No blocks in this page
          </div>
        ) : (
          blocks.map((block, index) => (
            <div key={block.id} style={styles.blockCard}>
              <div style={styles.blockHeader}>
                <span style={styles.blockType}>
                  {block.block_type}
                </span>
                <span style={{ ...styles.pageIndex }}>
                  Block {index + 1}
                </span>
              </div>
              {renderBlockContent(block)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};