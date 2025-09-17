import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../styles';

export interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link: string;
}

export interface PortfolioSectionProps {
  projects: PortfolioProject[];
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  projects
}) => {
  const { theme, tokens } = useTheme();
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = projects.map((project) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = project.image;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.warn('Some portfolio images failed to preload:', error);
        setImagesLoaded(true);
      }
    };

    if (projects.length > 0) {
      preloadImages();
    }
  }, [projects]);

  const getStyles = () => ({
    container: {
      backgroundColor: theme.surfaceContainer,
      borderColor: theme.outline,
      boxShadow: tokens.shadows.lg,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[8],
      border: `1px solid ${theme.outline}`,
      marginBottom: tokens.spacing[8],
    },
    title: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[6],
      fontWeight: '700',
    },
    projectGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: tokens.spacing[8],
      alignItems: 'center',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
      },
    },
    imageContainer: {
      position: 'relative' as const,
      overflow: 'hidden',
      borderRadius: tokens.borderRadius.medium,
      boxShadow: tokens.shadows.lg,
      cursor: 'pointer',
    },
    loadingContainer: {
      width: '100%',
      height: '256px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surfaceVariant,
    },
    loadingSpinner: {
      width: '32px',
      height: '32px',
      border: `2px solid ${theme.outline}`,
      borderTop: `2px solid ${theme.primary}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    projectImage: {
      width: '100%',
      height: '256px',
      objectFit: 'cover' as const,
      transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
    },
    imageOverlay: {
      position: 'absolute' as const,
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    projectContent: {
      flex: 1,
    },
    projectTitle: {
      ...tokens.typography.headline.small,
      color: theme.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[3],
      fontWeight: '600',
    },
    projectDescription: {
      ...tokens.typography.body.large,
      color: theme.onSurfaceVariant,
      lineHeight: '1.6',
      marginBottom: tokens.spacing[4],
    },
    technologiesContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: tokens.spacing[2],
      marginBottom: tokens.spacing[6],
    },
    technologyChip: {
      padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
      borderRadius: tokens.borderRadius.full,
      backgroundColor: `rgba(${theme.primary.replace('#', '')}, 0.1)`,
      color: theme.primary,
      fontSize: tokens.typography.body.small.fontSize,
      fontWeight: '500',
    },
    viewButton: {
      padding: `${tokens.spacing[2]} ${tokens.spacing[6]}`,
      borderRadius: tokens.borderRadius.medium,
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      border: 'none',
      cursor: 'pointer',
      ...tokens.typography.body.medium,
      fontWeight: '500',
      transition: 'all 0.15s ease-in-out',
    },
    controls: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: tokens.spacing[6],
    },
    navButton: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
      padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
      borderRadius: tokens.borderRadius.medium,
      backgroundColor: theme.surfaceVariant,
      color: theme.onSurface,
      border: `1px solid ${theme.outline}`,
      cursor: 'pointer',
      transition: 'all 0.15s ease-in-out',
    },
    dotsContainer: {
      display: 'flex',
      gap: tokens.spacing[2],
      alignItems: 'center',
    },
    dot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'all 0.15s ease-in-out',
    },
  });

  const styles = getStyles();

  const nextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0';
  };

  if (!projects || projects.length === 0) {
    return null;
  }

  const currentProject = projects[currentProjectIndex];

  return (
    <div style={styles.container} data-testid="portfolio-section">
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <h2 style={styles.title}>Featured Projects</h2>

      <div style={styles.projectGrid}>
        <div
          style={styles.imageContainer}
          onMouseEnter={(e) => {
            const overlay = e.currentTarget.querySelector('[data-overlay]') as HTMLElement;
            const img = e.currentTarget.querySelector('img') as HTMLElement;
            if (overlay) overlay.style.opacity = '1';
            if (img) img.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            const overlay = e.currentTarget.querySelector('[data-overlay]') as HTMLElement;
            const img = e.currentTarget.querySelector('img') as HTMLElement;
            if (overlay) overlay.style.opacity = '0';
            if (img) img.style.transform = 'scale(1)';
          }}
        >
          {!imagesLoaded && (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
            </div>
          )}
          <img
            src={currentProject.image}
            alt={currentProject.title}
            style={{
              ...styles.projectImage,
              opacity: imagesLoaded ? 1 : 0,
            }}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x256/cccccc/666666?text=Project+Image';
            }}
          />
          <div style={styles.imageOverlay} data-overlay />
        </div>

        <div style={styles.projectContent}>
          <h3 style={styles.projectTitle}>{currentProject.title}</h3>
          <p style={styles.projectDescription}>{currentProject.description}</p>

          <div style={styles.technologiesContainer}>
            {currentProject.technologies.map((tech, index) => (
              <span
                key={index}
                style={{
                  ...styles.technologyChip,
                  backgroundColor: `rgba(${hexToRgb(theme.primary)}, 0.1)`,
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          <button
            style={styles.viewButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = tokens.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={() => {
              if (currentProject.link !== '#') {
                window.open(currentProject.link, '_blank');
              }
            }}
          >
            View Project
          </button>
        </div>
      </div>

      <div style={styles.controls}>
        <button
          onClick={prevProject}
          style={styles.navButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = tokens.shadows.medium;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          ← Previous
        </button>

        <div style={styles.dotsContainer}>
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentProjectIndex(index)}
              style={{
                ...styles.dot,
                backgroundColor: index === currentProjectIndex
                  ? theme.primary
                  : theme.outline,
              }}
            />
          ))}
        </div>

        <button
          onClick={nextProject}
          style={styles.navButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = tokens.shadows.medium;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};