import React from 'react';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { useTheme } from '../../../styles';

interface DroppableBlockAreaProps {
  onBlockAdd: (blockType: string, insertIndex: number) => void;
  insertIndex: number;
  isLast?: boolean;
}

export const DroppableBlockArea: React.FC<DroppableBlockAreaProps> = ({
  onBlockAdd,
  insertIndex,
  isLast = false,
}) => {
  const { colors, tokens } = useTheme();

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'BLOCK_TYPE',
    drop: (item: { blockType: string }) => {
      onBlockAdd(item.blockType, insertIndex);
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const getStyles = () => ({
    dropArea: {
      height: isOver && canDrop ? '40px' : '8px',
      transition: 'height 0.2s ease',
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropIndicator: {
      width: '100%',
      height: '3px',
      backgroundColor: colors.primary,
      borderRadius: '2px',
      opacity: isOver && canDrop ? 1 : 0,
      transition: 'opacity 0.2s ease',
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
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: isOver && canDrop ? 1 : 0,
      transition: 'opacity 0.2s ease',
      whiteSpace: 'nowrap' as const,
    },
  });

  const styles = getStyles();

  return (
    <div ref={drop} style={styles.dropArea}>
      <div style={styles.dropIndicator} />
      {isOver && canDrop && (
        <div style={styles.dropText}>
          Drop block here
        </div>
      )}
    </div>
  );
};