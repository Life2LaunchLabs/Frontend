import React, { useRef, useState } from 'react';
import { useDrag, useDrop, DragSourceMonitor, DropTargetMonitor } from 'react-dnd';
import { useTheme } from '../../../styles';
import { IconButton } from '../../../shared/components';
import { EditableBlockRenderer } from './EditableBlockRenderer';
import { Block, MediaAsset } from '../../activities/types';

interface DraggableBlockProps {
  block: Block;
  media: MediaAsset[];
  blockIndex: number;
  pageIndex: number;
  onBlockChange: (block: Block) => void;
  onBlockDelete: () => void;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  media,
  blockIndex,
  pageIndex,
  onBlockChange,
  onBlockDelete,
}) => {
  const { colors, tokens } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BLOCK_MOVE',
    item: {
      blockId: block.id,
      blockType: block.block_type,
      sourcePageIndex: pageIndex,
      sourceBlockIndex: blockIndex,
      isExistingBlock: true,
      block: block
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Connect drag ref
  drag(ref);

  const getStyles = () => ({
    container: {
      position: 'relative' as const,
      backgroundColor: colors.surface,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[4],
      border: `1px solid ${colors.outline}`,
      opacity: isDragging ? 0.5 : 1,
      cursor: isDragging ? 'grabbing' : 'default',
      transition: 'opacity 0.2s ease',
    },
    header: {
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
    dragHandle: {
      cursor: 'grab',
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
  });

  const styles = getStyles();

  // Handle drag handle click - prevent event bubbling to page drag
  const handleDragHandleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    onBlockDelete();
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div ref={ref} style={styles.container}>
      <div style={styles.header}>
        <span style={styles.blockType}>
          {block.block_type}
        </span>
        <div style={styles.blockActions}>
          <div
            style={styles.dragHandle}
            onMouseDown={handleDragHandleMouseDown}
          >
            <IconButton
              icon="drag_indicator"
              variant="outlined"
              title="Drag to reorder block"
            />
          </div>
          <IconButton
            icon="delete"
            variant="outlined"
            onClick={handleDeleteClick}
            title="Delete block"
          />
        </div>
      </div>

      {/* Render the block content using editable BlockRenderer */}
      <EditableBlockRenderer
        block={block}
        media={media}
        onChange={onBlockChange}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div style={styles.deleteConfirmDialog}>
          <div style={styles.deleteConfirmCard}>
            <h3 style={styles.deleteConfirmTitle}>Delete Block</h3>
            <p style={styles.deleteConfirmText}>
              Are you sure you want to delete this {block.block_type} block?
              This action cannot be undone.
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
    </div>
  );
};