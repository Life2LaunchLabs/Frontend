import React from 'react';
import { useDrag, useDrop, DragSourceMonitor, DropTargetMonitor } from 'react-dnd';
import { DroppablePageCard } from './DroppablePageCard';
import { Page, Block, MediaAsset } from '../../activities/types';

interface DraggablePageCardProps {
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
  onPageReorder: (dragIndex: number, hoverIndex: number) => void;
}

export const DraggablePageCard: React.FC<DraggablePageCardProps> = ({
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
  onPageReorder,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PAGE',
    item: { pageIndex },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'PAGE',
    hover: (item: { pageIndex: number }, monitor: DropTargetMonitor) => {
      if (!monitor.isOver()) return;

      const dragIndex = item.pageIndex;
      const hoverIndex = pageIndex;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      // Call the reorder function
      onPageReorder(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.pageIndex = hoverIndex;
    },
  }));

  // Combine drag and drop refs
  const dragDropRef = (node: HTMLDivElement | null) => {
    drag(drop(node));
  };

  return (
    <div
      ref={dragDropRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: 'opacity 0.2s ease',
      }}
    >
      <DroppablePageCard
        page={page}
        blocks={blocks}
        media={media}
        pageNumber={pageNumber}
        pageIndex={pageIndex}
        onPageChange={onPageChange}
        onBlockChange={onBlockChange}
        onBlockDelete={onBlockDelete}
        onPageDelete={onPageDelete}
        onBlockAdd={onBlockAdd}
        onBlockMove={onBlockMove}
      />
    </div>
  );
};