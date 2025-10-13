import React, { useState } from 'react';
import { useTheme } from '../../../styles';
import { IconButton } from '../../../shared/components';
import { DraggableBlock } from './DraggableBlock';
import { DroppableBlockArea } from './DroppableBlockArea';
import { Page, Block, MediaAsset } from '../../activities/types';

interface PageEditCardProps {
  page: Page;
  blocks: Block[];
  media: MediaAsset[];
  pageNumber: number;
  pageIndex: number;
  onPageChange: (page: Page) => void;
  onBlockChange: (blockId: string, block: Block) => void;
  onBlockDelete: (blockId: string) => void;
  onPageDelete: () => void;
  onBlockAdd: (blockType: string, insertIndex: number) => void;
  dropPreview?: { index: number; position: 'above' | 'below' } | null;
  isOver?: boolean;
}

export const PageEditCard: React.FC<PageEditCardProps> = ({
  page,
  blocks,
  media,
  pageNumber,
  pageIndex,
  onPageChange,
  onBlockChange: _onBlockChange,
  onBlockDelete,
  onPageDelete,
  onBlockAdd,
  dropPreview,
  isOver,
}) => {
  const { colors, tokens } = useTheme();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(page.title || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
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
      margin: 0,
      marginBottom: tokens.spacing[2],
      cursor: 'pointer',
      padding: tokens.spacing[2],
      borderRadius: tokens.borderRadius.small,
      transition: 'background-color 0.2s ease',
    },
    pageTitleHover: {
      backgroundColor: colors.surfaceContainerHighest,
    },
    pageTitleInput: {
      ...tokens.typography.headline.medium,
      color: colors.onSurface,
      backgroundColor: 'transparent',
      border: `2px solid ${colors.primary}`,
      borderRadius: tokens.borderRadius.small,
      padding: tokens.spacing[2],
      width: '100%',
      outline: 'none',
    },
    pageIndex: {
      ...tokens.typography.body.small,
      color: colors.onSurfaceVariant,
      marginLeft: tokens.spacing[2],
    },
    blocksContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
    },
    blockContainer: {
      position: 'relative' as const,
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
    blockActions: {
      display: 'flex',
      gap: tokens.spacing[1],
    },
    emptyState: {
      textAlign: 'center' as const,
      color: colors.onSurfaceVariant,
      fontStyle: 'italic',
      padding: tokens.spacing[8],
    },
    deleteConfirmDialog: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    deleteConfirmCard: {
      backgroundColor: colors.surface,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[8],
      maxWidth: '400px',
      width: '90%',
    },
    deleteConfirmTitle: {
      ...tokens.typography.headline.small,
      color: colors.onSurface,
      marginBottom: tokens.spacing[4],
    },
    deleteConfirmText: {
      ...tokens.typography.body.medium,
      color: colors.onSurfaceVariant,
      marginBottom: tokens.spacing[6],
    },
    deleteConfirmActions: {
      display: 'flex',
      gap: tokens.spacing[3],
      justifyContent: 'flex-end',
    },
    dropIndicator: {
      position: 'relative' as const,
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: `${tokens.spacing[2]} 0`,
    },
    dropLine: {
      width: '100%',
      height: '3px',
      backgroundColor: colors.primary,
      borderRadius: '2px',
      boxShadow: `0 0 8px ${colors.primary}`,
    },
    dropText: {
      ...tokens.typography.body.small,
      color: colors.primary,
      backgroundColor: colors.surface,
      padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
      borderRadius: tokens.borderRadius.small,
      border: `1px solid ${colors.primary}`,
      position: 'absolute' as const,
      whiteSpace: 'nowrap' as const,
    },
  });

  const styles = getStyles();

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setEditedTitle(page.title || '');
  };

  const handleTitleSave = () => {
    const updatedPage = { ...page, title: editedTitle };
    onPageChange(updatedPage);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditedTitle(page.title || '');
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    onPageDelete();
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            {isEditingTitle ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                style={styles.pageTitleInput}
                autoFocus
                placeholder={`Page ${page.index + 1}`}
              />
            ) : (
              <h3
                style={styles.pageTitle}
                onClick={handleTitleClick}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, styles.pageTitleHover);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, styles.pageTitle);
                }}
                title="Click to edit title"
              >
                {page.title || `Page ${page.index + 1}`}
              </h3>
            )}
            <div style={styles.pageIndex}>
              Index: {page.index} • ID: {page.id.slice(0, 8)}...
            </div>
          </div>

          <div style={styles.headerRight}>
            <div style={styles.pageNumber}>
              Page {pageNumber}
            </div>
            <IconButton
              icon="delete"
              variant="outlined"
              onClick={handleDeleteClick}
              title="Delete page"
            />
          </div>
        </div>

        <div style={styles.blocksContainer} data-page-content>
          {blocks.length === 0 ? (
            <div style={styles.emptyState}>
              No blocks in this page. Drag block types from the left panel to add content.
            </div>
          ) : (
            blocks.map((block, index) => (
              <React.Fragment key={block.id}>
                {/* Drop indicator above this block */}
                {isOver && dropPreview && dropPreview.index === index && (
                  <div style={styles.dropIndicator}>
                    <div style={styles.dropLine} />
                    <span style={styles.dropText}>Drop block here</span>
                  </div>
                )}

                {/* Draggable Block */}
                <div data-block-index={index}>
                  <DraggableBlock
                    block={block}
                    media={media}
                    blockIndex={index}
                    pageIndex={pageIndex}
                    onBlockChange={(updatedBlock) => _onBlockChange(block.id, updatedBlock)}
                    onBlockDelete={() => onBlockDelete(block.id)}
                  />
                </div>
              </React.Fragment>
            ))
          )}

          {/* Drop indicator at the end */}
          {isOver && dropPreview && dropPreview.index === blocks.length && (
            <div style={styles.dropIndicator}>
              <div style={styles.dropLine} />
              <span style={styles.dropText}>Drop block here</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div style={styles.deleteConfirmDialog}>
          <div style={styles.deleteConfirmCard}>
            <h3 style={styles.deleteConfirmTitle}>Delete Page</h3>
            <p style={styles.deleteConfirmText}>
              Are you sure you want to delete "{page.title || `Page ${page.index + 1}`}"?
              This action cannot be undone and will also delete all {blocks.length} blocks in this page.
            </p>
            <div style={styles.deleteConfirmActions}>
              <IconButton
                icon="close"
                variant="outlined"
                onClick={handleDeleteCancel}
                title="Cancel"
              />
              <IconButton
                icon="delete"
                variant="filled"
                onClick={handleDeleteConfirm}
                title="Delete"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};