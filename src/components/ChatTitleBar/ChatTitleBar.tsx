import React, { useState } from 'react';
import { useTheme } from '../../theme';
import { Button } from '../Button';
import { IconButton } from '../IconButton';

export type AgendaStatus = 'not_started' | 'in_progress' | 'completed';

export interface AgendaItem {
  id: string;
  text: string;
  status: AgendaStatus;
}

export interface ChatTitleBarProps {
  title: string;
  items?: AgendaItem[];
  onResultsClick?: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
  showResultsButton?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ChatTitleBar: React.FC<ChatTitleBarProps> = ({
  title,
  items = [],
  onResultsClick,
  onBackClick,
  showBackButton = true,
  showResultsButton = true,
  className,
  style,
}) => {
  const { theme, tokens } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-calculate progress and active item from status
  const hasAgenda = items.length > 0;
  const completedItems = items.filter(item => item.status === 'completed');
  const progressPercent = hasAgenda ? Math.round((completedItems.length / items.length) * 100) : 0;
  const activeItem = items.find(item => item.status === 'in_progress');
  const currentItem = activeItem?.text;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative' as const,
    display: 'flex',
    gap: tokens.spacing[3],
    ...style,
  };

  const mainCardStyles: React.CSSProperties = {
    flex: 1,
    backgroundColor: `${theme.surfaceContainer}E6`, // 90% opacity
    backdropFilter: 'blur(8px)',
    borderRadius: tokens.borderRadius.large,
  };

  const headerStyles: React.CSSProperties = {
    cursor: 'pointer',
    borderRadius: tokens.borderRadius.large,
    padding: `${tokens.spacing[4]} ${tokens.spacing[5]}`,
    backgroundColor: 'transparent',
  };

  const titleRowStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing[3],
  };

  const titleStyles: React.CSSProperties = {
    ...tokens.typography.headline.small,
    color: theme.onSurface,
    margin: 0,
  };

  const currentItemStyles: React.CSSProperties = {
    ...tokens.typography.body.small,
    color: theme.onSurfaceVariant,
    margin: 0,
    marginTop: tokens.spacing[1],
  };


  const progressContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing[3],
  };

  const progressInfoStyles: React.CSSProperties = {
    flex: 1,
  };

  const progressLabelStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing[1],
    ...tokens.typography.body.small,
    color: theme.onSurfaceVariant,
  };

  const progressBarBackgroundStyles: React.CSSProperties = {
    width: '100%',
    height: '8px',
    backgroundColor: theme.surfaceContainerHigh,
    borderRadius: tokens.borderRadius.full,
    overflow: 'hidden' as const,
  };

  const progressBarFillStyles: React.CSSProperties = {
    width: `${Math.min(100, Math.max(0, progressPercent))}%`,
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: tokens.borderRadius.full,
    transition: 'width 0.3s ease-in-out',
  };

  const expandButtonStyles: React.CSSProperties = {
    padding: tokens.spacing[1],
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: theme.onSurfaceVariant,
    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s ease-in-out',
  };

  const accordionContentStyles: React.CSSProperties = {
    overflow: 'hidden',
    transition: 'max-height 0.3s ease-in-out, opacity 0.2s ease-in-out, padding 0.3s ease-in-out',
    maxHeight: isExpanded ? '500px' : '0px',
    opacity: isExpanded ? 1 : 0,
    paddingTop: isExpanded ? tokens.spacing[3] : '0px',
    paddingBottom: isExpanded ? tokens.spacing[3] : '0px',
    paddingLeft: tokens.spacing[5],
    paddingRight: tokens.spacing[5],
  };

  const agendaItemStyles = (item: AgendaItem): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: `${tokens.spacing[2]} 0`,
    backgroundColor: item.status === 'in_progress' ? theme.primaryContainer : 'transparent',
    borderRadius: item.status === 'in_progress' ? tokens.borderRadius.medium : '0',
    margin: item.status === 'in_progress' ? `0 -${tokens.spacing[2]}` : '0',
    paddingLeft: item.status === 'in_progress' ? tokens.spacing[2] : '0',
    paddingRight: item.status === 'in_progress' ? tokens.spacing[2] : '0',
  });

  const iconStyles: React.CSSProperties = {
    width: '20px',
    height: '20px',
    marginRight: tokens.spacing[3],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const itemTextStyles = (item: AgendaItem): React.CSSProperties => ({
    ...tokens.typography.body.small,
    color: item.status === 'in_progress' ? theme.primary : theme.onSurface,
    fontWeight: item.status === 'in_progress' ? '500' : '400',
    margin: 0,
  });

  const resultsButtonStyles: React.CSSProperties = {
    minHeight: '60px',
    alignSelf: 'flex-start',
  };

  return (
    <div 
      className={className}
      style={containerStyles}
      data-testid="chat-title-bar"
    >
      <div style={mainCardStyles}>
        <div 
          style={headerStyles}
          onClick={toggleExpanded}
          data-testid="chat-title-header"
        >
          <div style={titleRowStyles}>
            <div>
              <h1 style={titleStyles}>{title}</h1>
              {currentItem && (
                <p style={currentItemStyles}>{currentItem}</p>
              )}
            </div>
            {showBackButton && (
              <IconButton
                icon="arrow_back"
                onClick={handleBackClick}
                variant="standard"
                aria-label="Back"
                data-testid="back-button"
              />
            )}
          </div>

          {hasAgenda && (
            <div style={progressContainerStyles}>
              <div style={progressInfoStyles}>
                <div style={progressLabelStyles}>
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div style={progressBarBackgroundStyles}>
                  <div style={progressBarFillStyles} />
                </div>
              </div>
              <button
                style={expandButtonStyles}
                aria-label={isExpanded ? "Collapse agenda" : "Expand agenda"}
                data-testid="expand-button"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Accordion Content */}
        <div 
          style={accordionContentStyles}
          data-testid="chat-title-accordion"
        >
          {items.map((item) => (
            <div 
              key={item.id} 
              style={agendaItemStyles(item)}
              data-testid={`agenda-item-${item.id}`}
            >
              <div style={iconStyles}>
                {item.status === 'completed' ? (
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7"
                      stroke={theme.tertiary} // Using tertiary color for success
                    />
                  </svg>
                ) : item.status === 'in_progress' ? (
                  <div 
                    style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: theme.primary,
                      borderRadius: tokens.borderRadius.full,
                    }}
                  />
                ) : (
                  <div 
                    style={{
                      width: '16px',
                      height: '16px',
                      border: `2px solid ${theme.onSurfaceVariant}`,
                      borderRadius: tokens.borderRadius.full,
                    }}
                  />
                )}
              </div>
              <span style={itemTextStyles(item)}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showResultsButton && progressPercent === 100 && hasAgenda && onResultsClick && (
        <Button
          variant="filled"
          onClick={onResultsClick}
          style={resultsButtonStyles}
          icon={false}
          data-testid="results-button"
        >
          Results
        </Button>
      )}
    </div>
  );
};