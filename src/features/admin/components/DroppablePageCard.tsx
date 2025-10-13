import React, { useRef, useState } from 'react';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { useTheme } from '../../../styles';
import { PageEditCard } from './PageEditCard';
import { Page, Block, MediaAsset } from '../../activities/types';

interface DroppablePageCardProps {
  page: Page;
  blocks: Block[];
  media: MediaAsset[];
  pageNumber: number;
  pageIndex: number;
  onPageChange: (page: Page) => void;
  onBlockChange: (blockId: string, block: Block) => void;
  onBlockDelete: (blockId: string) => void;
  onPageDelete: () => void;
  onBlockAdd: (blockType: string, insertIndex?: number) => void;
  onBlockMove: (sourcePageIndex: number, sourceBlockIndex: number, targetPageIndex: number, targetInsertIndex: number, block?: Block) => void;
}

export const DroppablePageCard: React.FC<DroppablePageCardProps> = ({
  page,
  blocks,
  media,
  pageNumber,
  pageIndex,
  onPageChange,
  onBlockChange,
  onBlockDelete,
  onPageDelete,
  onBlockAdd,
  onBlockMove,
}) => {
  const { colors, tokens } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropPreview, setDropPreview] = useState<{ index: number; position: 'above' | 'below' } | null>(null);

  const calculateInsertIndex = (mouseY: number): number => {
    if (!containerRef.current) return blocks.length;

    const pageCardElement = containerRef.current.querySelector('[data-page-content]');
    if (!pageCardElement) return blocks.length;

    const blockElements = pageCardElement.querySelectorAll('[data-block-index]');

    if (blockElements.length === 0) return 0;

    for (let i = 0; i < blockElements.length; i++) {
      const blockElement = blockElements[i] as HTMLElement;
      const rect = blockElement.getBoundingClientRect();
      const blockMiddle = rect.top + rect.height / 2;

      if (mouseY < blockMiddle) {
        return i; // Insert before this block
      }
    }

    return blocks.length; // Insert at end
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'BLOCK_MOVE',
    drop: (item: any, monitor: DropTargetMonitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        if (item.isExistingBlock) {
          onBlockMove(item.sourcePageIndex, item.sourceBlockIndex, pageIndex, blocks.length, item.block);
        } else {
          onBlockAdd(item.blockType, blocks.length);
        }
        return;
      }

      // Calculate the best insertion point based on drop position
      const insertIndex = calculateInsertIndex(clientOffset.y);

      if (item.isExistingBlock) {
        // Moving an existing block
        onBlockMove(item.sourcePageIndex, item.sourceBlockIndex, pageIndex, insertIndex, item.block);
      } else {
        // Adding a new block
        onBlockAdd(item.blockType, insertIndex);
      }

      setDropPreview(null);
    },
    hover: (item: any, monitor: DropTargetMonitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        setDropPreview(null);
        return;
      }

      const insertIndex = calculateInsertIndex(clientOffset.y);

      // Don't show preview if dropping in the same position
      if (item.isExistingBlock &&
          item.sourcePageIndex === pageIndex &&
          item.sourceBlockIndex === insertIndex) {
        setDropPreview(null);
        return;
      }

      setDropPreview({
        index: insertIndex,
        position: insertIndex === 0 ? 'above' : 'below'
      });
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Combine refs
  const combinedRef = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    drop(node);
  };

  const getStyles = () => ({
    container: {
      position: 'relative' as const,
      transition: 'all 0.2s ease',
    },
    dropOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: `${colors.primary}20`,
      border: `2px dashed ${colors.primary}`,
      borderRadius: tokens.borderRadius.large,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      pointerEvents: 'none' as const,
    },
    dropText: {
      ...tokens.typography.body.large,
      color: colors.primary,
      fontWeight: 'bold',
    },
  });

  const styles = getStyles();

  return (
    <div ref={combinedRef} style={styles.container}>
      <PageEditCard
        page={page}
        blocks={blocks}
        media={media}
        pageNumber={pageNumber}
        pageIndex={pageIndex}
        onPageChange={onPageChange}
        onBlockChange={onBlockChange}
        onBlockDelete={onBlockDelete}
        onPageDelete={onPageDelete}
        onBlockAdd={(blockType, insertIndex) => onBlockAdd(blockType, insertIndex)}
        dropPreview={dropPreview}
        isOver={isOver}
      />
    </div>
  );
};