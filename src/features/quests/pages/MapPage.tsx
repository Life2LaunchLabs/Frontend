import React, { useRef, useEffect, useState } from 'react';
import { FolderLayout, TabItem } from '../../../shared/components';
import { useTheme } from '../../../styles';
import mapImage from '../../../shared/assets/images/map.png';

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'profile', label: 'Profile', path: '/profile' },
  { id: 'map', label: 'Map', path: '/map' },
  { id: 'explore', label: 'Explore', path: '/explore' },
];

interface QuestMarker {
  id: string;
  x: number; // Percentage from left (0-100)
  y: number; // Percentage from top (0-100)
  title: string;
  description: string;
  status: 'available' | 'in-progress' | 'completed';
}

const questMarkers: QuestMarker[] = [
  {
    id: 'quest-1',
    x: 45,
    y: 40,
    title: 'The Lost Temple',
    description: 'Explore the ancient temple ruins and uncover hidden treasures.',
    status: 'available'
  },
  {
    id: 'quest-2',
    x: 55,
    y: 35,
    title: 'Dragon\'s Lair',
    description: 'Brave adventurers needed to investigate dragon sightings.',
    status: 'in-progress'
  },
  {
    id: 'quest-3',
    x: 50,
    y: 60,
    title: 'Village Rescue',
    description: 'Help the villagers rebuild after the storm.',
    status: 'completed'
  },
  {
    id: 'quest-4',
    x: 60,
    y: 50,
    title: 'Crystal Caves',
    description: 'Mine rare crystals from the dangerous underground caverns.',
    status: 'available'
  }
];

export const MapPage: React.FC = () => {
  const { theme, tokens } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Center the map on initial load
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const centerX = (container.scrollWidth - container.clientWidth) / 2;
      const centerY = (container.scrollHeight - container.clientHeight) / 2;

      container.scrollTo({
        left: centerX,
        top: centerY,
        behavior: 'smooth'
      });
    }
  }, []);

  const getStyles = () => ({
    wrapper: {
      position: 'relative' as const,
      width: '100%',
      height: '100%',
    },
    mapContainer: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto',
      border: `2px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.medium,
    },
    mapImageContainer: {
      position: 'relative' as const,
      display: 'inline-block',
    },
    mapImage: {
      display: 'block',
      width: '1200px', // Fixed size to maintain original dimensions
      height: 'auto',
      userSelect: 'none' as const,
    },
    questMarker: {
      position: 'absolute' as const,
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      border: '2px solid white',
      cursor: 'pointer',
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.2s ease',
      zIndex: 10,
    },
    markerAvailable: {
      backgroundColor: '#DC2626', // Red
      boxShadow: '0 0 10px rgba(220, 38, 38, 0.6)',
    },
    markerInProgress: {
      backgroundColor: '#DC2626', // Red
      boxShadow: '0 0 10px rgba(220, 38, 38, 0.6)',
    },
    markerCompleted: {
      backgroundColor: '#DC2626', // Red
      boxShadow: '0 0 10px rgba(220, 38, 38, 0.6)',
    },
    markerHovered: {
      transform: 'translate(-50%, -50%) scale(1.5)',
      zIndex: 20,
    },
    tooltip: {
      position: 'fixed' as const,
      backgroundColor: theme.surfaceContainer,
      border: `1px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[3],
      boxShadow: tokens.shadows.lg,
      zIndex: 30,
      pointerEvents: 'none' as const,
      maxWidth: '250px',
    },
    tooltipTitle: {
      ...tokens.typography.title.medium,
      color: theme.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[1],
      fontWeight: '600',
    },
    tooltipDescription: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      margin: 0,
      lineHeight: '1.4',
    },
    tooltipStatus: {
      ...tokens.typography.label.small,
      marginTop: tokens.spacing[1],
      padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
      borderRadius: tokens.borderRadius.small,
      display: 'inline-block',
      fontWeight: '500',
    },
    statusAvailable: {
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      color: '#059669',
    },
    statusInProgress: {
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      color: '#D97706',
    },
    statusCompleted: {
      backgroundColor: 'rgba(107, 114, 128, 0.2)',
      color: '#4B5563',
    },
  });

  const styles = getStyles();

  const handleMenuClick = () => {
    console.log('Map menu clicked');
  };

  const handleMarkerHover = (markerId: string, event: React.MouseEvent) => {
    setHoveredMarker(markerId);
    setTooltipPosition({
      x: event.clientX + 10,
      y: event.clientY - 10
    });
  };

  const handleMarkerLeave = () => {
    setHoveredMarker(null);
  };

  const getMarkerStyle = (marker: QuestMarker) => {
    const baseStyle = {
      ...styles.questMarker,
      left: `${marker.x}%`,
      top: `${marker.y}%`,
    };

    const statusStyle = marker.status === 'available' ? styles.markerAvailable :
                       marker.status === 'in-progress' ? styles.markerInProgress :
                       styles.markerCompleted;

    const hoverStyle = hoveredMarker === marker.id ? styles.markerHovered : {};

    return { ...baseStyle, ...statusStyle, ...hoverStyle };
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'available': return styles.statusAvailable;
      case 'in-progress': return styles.statusInProgress;
      case 'completed': return styles.statusCompleted;
      default: return {};
    }
  };

  const hoveredMarkerData = questMarkers.find(m => m.id === hoveredMarker);

  return (
    <FolderLayout title="Quest Map" tabs={tabs} onMenuClick={handleMenuClick}>
      <div style={styles.wrapper} data-testid="map-page">
        <div
          ref={scrollContainerRef}
          style={styles.mapContainer}
        >
          <div style={styles.mapImageContainer}>
            <img
              src={mapImage}
              alt="Quest Map"
              style={styles.mapImage}
              draggable={false}
            />

            {questMarkers.map((marker) => (
              <div
                key={marker.id}
                style={getMarkerStyle(marker)}
                onMouseEnter={(e) => handleMarkerHover(marker.id, e)}
                onMouseLeave={handleMarkerLeave}
                onMouseMove={(e) => {
                  if (hoveredMarker === marker.id) {
                    setTooltipPosition({
                      x: e.clientX + 10,
                      y: e.clientY - 10
                    });
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {hoveredMarkerData && (
        <div
          style={{
            ...styles.tooltip,
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          <h3 style={styles.tooltipTitle}>{hoveredMarkerData.title}</h3>
          <p style={styles.tooltipDescription}>{hoveredMarkerData.description}</p>
          <div style={{
            ...styles.tooltipStatus,
            ...getStatusStyle(hoveredMarkerData.status)
          }}>
            {hoveredMarkerData.status.replace('-', ' ').toUpperCase()}
          </div>
        </div>
      )}
    </FolderLayout>
  );
};