import React from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { useTheme } from '../../../styles';

export interface DraggableBlockTypeProps {
  type: string;
  icon: string;
  label: string;
}

export const DraggableBlockType: React.FC<DraggableBlockTypeProps> = ({
  type,
  icon,
  label
}) => {
  const { colors, tokens } = useTheme();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BLOCK_MOVE',
    item: {
      blockType: type,
      isExistingBlock: false
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getStyles = () => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
      padding: tokens.spacing[3],
      backgroundColor: isDragging ? colors.surfaceContainerHighest : colors.surface,
      borderRadius: tokens.borderRadius.medium,
      border: `1px solid ${colors.outline}`,
      marginBottom: tokens.spacing[2],
      cursor: 'grab',
      transition: 'all 0.2s ease',
      opacity: isDragging ? 0.5 : 1,
    },
    containerHover: {
      backgroundColor: colors.surfaceContainerHighest,
      borderColor: colors.primary,
    },
    icon: {
      fontSize: '20px',
      color: colors.onSurfaceVariant,
    },
    label: {
      ...tokens.typography.body.medium,
      color: colors.onSurface,
    },
  });

  const styles = getStyles();

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      Object.assign(e.currentTarget.style, styles.containerHover);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      Object.assign(e.currentTarget.style, styles.container);
    }
  };

  return (
    <div
      ref={drag}
      style={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={`Drag ${label} to add to page`}
    >
      <span className="material-symbols-outlined" style={styles.icon}>
        {icon}
      </span>
      <span style={styles.label}>
        {label}
      </span>
    </div>
  );
};