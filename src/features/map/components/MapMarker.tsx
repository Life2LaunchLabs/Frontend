import React, { useState } from 'react';
import { useTheme } from '../../../styles';

export interface MapMarkerProps {
  id: string;
  x: number;
  y: number;
  title: string;
  description?: string;
  onClick?: (id: string) => void;
  onHover?: (id: string, isHovering: boolean) => void;
}

export const MapMarker: React.FC<MapMarkerProps> = ({
  id,
  x,
  y,
  title,
  onClick,
  onHover,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(id, true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(id, false);
  };

  const handleClick = () => {
    onClick?.(id);
  };

  const getStyles = () => ({
    markerGroup: {
      cursor: 'pointer',
    },
    markerBase: {
      fill: theme.primary,
      stroke: 'white',
      strokeWidth: 3,
      filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
    },
    markerDot: {
      fill: 'white',
    },
    tooltip: {
      fill: 'white',
      stroke: theme.outline,
      strokeWidth: 1,
      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
    },
    tooltipText: {
      fill: theme.onSurface,
      fontSize: '14px',
      fontWeight: '600',
      textAnchor: 'middle' as const,
      dominantBaseline: 'central' as const,
    },
  });

  const styles = getStyles();

  // Calculate tooltip position (above the marker)
  const tooltipY = y - 40;
  const tooltipWidth = Math.max(title.length * 8, 80);
  const tooltipHeight = 24;

  return (
    <g
      style={styles.markerGroup}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-testid={`map-marker-${id}`}
    >
      {/* Invisible larger hit area to prevent hover flickering */}
      <circle
        cx={x}
        cy={y - 10}
        r="25"
        fill="transparent"
        pointerEvents="all"
      />
      {/* Tooltip (only show on hover) */}
      {isHovered && (
        <g>
          <rect
            x={x - tooltipWidth / 2}
            y={tooltipY - tooltipHeight / 2}
            width={tooltipWidth}
            height={tooltipHeight}
            rx={4}
            style={styles.tooltip}
          />
          <text
            x={x}
            y={tooltipY}
            style={styles.tooltipText}
          >
            {title}
          </text>
        </g>
      )}

      {/* Map marker pin shape */}
      <path
        d={`M ${x} ${y - 20}
            C ${x - 10} ${y - 20} ${x - 20} ${y - 12} ${x - 20} ${y - 2}
            C ${x - 20} ${y + 8} ${x - 10} ${y + 16} ${x} ${y}
            C ${x + 10} ${y + 16} ${x + 20} ${y + 8} ${x + 20} ${y - 2}
            C ${x + 20} ${y - 12} ${x + 10} ${y - 20} ${x} ${y - 20} Z`}
        style={styles.markerBase}
      />

      {/* Center dot */}
      <circle
        cx={x}
        cy={y - 10}
        r="6"
        style={styles.markerDot}
      />
    </g>
  );
};