import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { IconButton } from '../../../shared/components';
import { MapMarker, ActivityDetailPane } from '../components';
import { useMapActivities } from '../api';
import isoMapImage from '../../../shared/assets/images/iso_map.png';


export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const { tokens } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const { data: activities, isLoading, error } = useMapActivities();

  // Image dimensions (will be set from actual image)
  const [imageDimensions, setImageDimensions] = useState({ width: 1500, height: 1500 });

  // Selected activity for detail pane
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  // Image scale factor (configurable)
  const IMAGE_SCALE = 2.0; // 1.0 = native resolution, 0.5 = half size, 2.0 = double size

  // Map dimensions in SVG coordinate space (scaled)
  const MAP_WIDTH = imageDimensions.width * IMAGE_SCALE;
  const MAP_HEIGHT = imageDimensions.height * IMAGE_SCALE;

  // ViewBox dimensions based on screen size / scale (to maintain fixed pixel resolution)
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 1000 });
  const VIEWPORT_WIDTH = containerSize.width / IMAGE_SCALE;
  const VIEWPORT_HEIGHT = containerSize.height / IMAGE_SCALE;
  const MAX_SCROLL_X = MAP_WIDTH - VIEWPORT_WIDTH;
  const MAX_SCROLL_Y = MAP_HEIGHT - VIEWPORT_HEIGHT;

  // ViewBox state: [x, y, width, height] - will be updated when image loads
  const [viewBox, setViewBox] = useState([0, 0, 1000, 1000]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Configurable scroll direction in degrees (0° = up, 90° = right, 180° = down, 270° = left)
  const SCROLL_ANGLE_DEGREES = 75; // Right (east)
  const SCROLL_ANGLE_RADIANS = (SCROLL_ANGLE_DEGREES * Math.PI) / 180;

  // Calculate unit vector components for the scroll direction
  // Rotate coordinate system: 0° points up, 90° points right
  const SCROLL_VECTOR_X = Math.sin(SCROLL_ANGLE_RADIANS);   // Component pointing right
  const SCROLL_VECTOR_Y = -Math.cos(SCROLL_ANGLE_RADIANS);  // Component pointing up (negative Y)

  const handleWheelNative = useCallback((e: WheelEvent) => {
    e.preventDefault();

    const scrollSpeed = 0.5;
    // Invert deltaY: scroll up (negative deltaY) should move in positive scroll direction
    const scrollAmount = -e.deltaY * scrollSpeed;

    // Apply the scroll amount along the configured vector
    const deltaX = scrollAmount * SCROLL_VECTOR_X;
    const deltaY = scrollAmount * SCROLL_VECTOR_Y;

    setViewBox(prev => {
      // Calculate new positions
      const newX = prev[0] + deltaX;
      const newY = prev[1] + deltaY;

      // Check if the vector movement would hit any boundary
      const wouldHitXBoundary = newX < 0 || newX > MAX_SCROLL_X;
      const wouldHitYBoundary = newY < 0 || newY > MAX_SCROLL_Y;

      // If any component of the vector would hit a boundary, don't move at all
      if (wouldHitXBoundary || wouldHitYBoundary) {
        return prev; // No movement
      }

      // Otherwise, apply the movement
      return [newX, newY, prev[2], prev[3]];
    });
  }, [SCROLL_VECTOR_X, SCROLL_VECTOR_Y, MAX_SCROLL_X, MAX_SCROLL_Y]);

  // Generate markers from activities data (bottom-left to top-right)
  const markers = React.useMemo(() => {
    if (!activities || activities.length === 0) return [];

    return activities.slice(0, 5).map((activity, index) => {
      // Position from bottom-left to top-right
      const progress = index / Math.max(activities.length - 1, 1);
      return {
        id: activity.id,
        x: MAP_WIDTH * (0.2 + progress * 0.6), // 0.2 to 0.8 horizontally
        y: MAP_HEIGHT * (0.8 - progress * 0.6), // 0.8 to 0.2 vertically (bottom to top)
        title: activity.title,
        description: activity.description,
        activity: activity,
      };
    });
  }, [activities, MAP_WIDTH, MAP_HEIGHT]);

  // Load image and get actual dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = isoMapImage;
  }, []);

  // Measure container size
  useEffect(() => {
    const updateContainerSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);

    return () => window.removeEventListener('resize', updateContainerSize);
  }, []);

  // Update viewBox when dimensions change
  useEffect(() => {
    const newMaxScrollY = MAP_HEIGHT - VIEWPORT_HEIGHT;

    // Set initial viewBox to bottom-left corner with correct dimensions
    setViewBox([0, newMaxScrollY, VIEWPORT_WIDTH, VIEWPORT_HEIGHT]);
  }, [imageDimensions, MAP_WIDTH, MAP_HEIGHT, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, IMAGE_SCALE]);

  useEffect(() => {
    // Hide scrollbars on html and body when map is active
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Add non-passive wheel event listener
    const svgElement = svgRef.current;
    if (svgElement) {
      svgElement.addEventListener('wheel', handleWheelNative, { passive: false });
    }

    // Cleanup: restore original overflow when component unmounts
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;

      if (svgElement) {
        svgElement.removeEventListener('wheel', handleWheelNative);
      }
    };
  }, [handleWheelNative]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    // Project mouse movement onto the configured scroll direction
    const dragSpeed = 0.8;

    // Calculate the component of movement along the scroll vector
    // Project (deltaX, deltaY) onto the scroll direction vector
    const diagonalMovement = (deltaX * SCROLL_VECTOR_X + deltaY * SCROLL_VECTOR_Y);

    // Apply movement along the scroll direction (negative for natural drag feel)
    const dragDeltaX = -diagonalMovement * SCROLL_VECTOR_X * dragSpeed;
    const dragDeltaY = -diagonalMovement * SCROLL_VECTOR_Y * dragSpeed;

    setViewBox(prev => {
      // Calculate new positions
      const newX = prev[0] + dragDeltaX;
      const newY = prev[1] + dragDeltaY;

      // Check if the vector movement would hit any boundary
      const wouldHitXBoundary = newX < 0 || newX > MAX_SCROLL_X;
      const wouldHitYBoundary = newY < 0 || newY > MAX_SCROLL_Y;

      // If any component of the vector would hit a boundary, don't move at all
      if (wouldHitXBoundary || wouldHitYBoundary) {
        return prev; // No movement
      }

      // Otherwise, apply the movement
      return [newX, newY, prev[2], prev[3]];
    });

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const getStyles = () => ({
    pageContainer: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
    },
    topBar: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 20,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: tokens.spacing[6],
    },
    closeButton: {
      alignSelf: 'flex-start',
    },
    userButton: {
      alignSelf: 'flex-end',
    },
    svgContainer: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      cursor: isDragging ? 'grabbing' : 'grab',
    },
  });

  const styles = getStyles();

  const handleClose = () => {
    navigate('/home');
  };

  const handleUserClick = () => {
    navigate('/account');
  };

  const handleMarkerClick = (activityId: string) => {
    setSelectedActivityId(activityId);
  };

  const handleMarkerHover = (_activityId: string, _isHovering: boolean) => {
    // Could add hover effects here if needed
  };

  const handleCloseDetailPane = () => {
    setSelectedActivityId(null);
  };

  const handleStartActivity = (activityId: string) => {
    console.log('Starting activity:', activityId);
    // Navigate to the new activity session page
    navigate(`/activities/active/${activityId}/0`);
    // Close the detail pane
    setSelectedActivityId(null);
  };

  // Get the selected activity data
  const selectedActivity = activities?.find(activity => activity.id === selectedActivityId) || null;

  return (
    <div style={styles.pageContainer} data-testid="map-page">
      <div style={styles.topBar}>
        <div style={styles.closeButton}>
          <IconButton
            icon="close"
            onClick={handleClose}
            variant="outlined"
          />
        </div>
        <div style={styles.userButton}>
          <IconButton
            icon="person"
            variant="filled"
            onClick={handleUserClick}
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'white',
            }}
          />
        </div>
      </div>

      <svg
        ref={svgRef}
        style={styles.svgContainer}
        viewBox={`${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="mapPattern" x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} patternUnits="userSpaceOnUse">
            <image
              href={isoMapImage}
              x="0"
              y="0"
              width={MAP_WIDTH}
              height={MAP_HEIGHT}
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>

        {/* Map background */}
        <rect
          x="0"
          y="0"
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          fill="url(#mapPattern)"
        />

        {/* Map markers */}
        {!isLoading && !error && markers.map((marker) => (
          <MapMarker
            key={marker.id}
            id={marker.id}
            x={marker.x}
            y={marker.y}
            title={marker.title}
            description={marker.description}
            onClick={handleMarkerClick}
            onHover={handleMarkerHover}
          />
        ))}

        {/* Loading state */}
        {isLoading && (
          <text
            x={MAP_WIDTH / 2}
            y={MAP_HEIGHT / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize="18"
            fontWeight="600"
          >
            Loading activities...
          </text>
        )}

        {/* Error state */}
        {error && (
          <text
            x={MAP_WIDTH / 2}
            y={MAP_HEIGHT / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#ff6b6b"
            fontSize="18"
            fontWeight="600"
          >
            Failed to load activities
          </text>
        )}
      </svg>

      {/* Activity Detail Pane */}
      {selectedActivity && (
        <ActivityDetailPane
          activity={selectedActivity}
          onClose={handleCloseDetailPane}
          onStartActivity={handleStartActivity}
        />
      )}
    </div>
  );
};