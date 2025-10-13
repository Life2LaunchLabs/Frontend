import React from 'react';
import { useTheme } from '../../../styles';

interface AddPageButtonProps {
  onAddPage: () => void;
  position: 'between' | 'end';
}

export const AddPageButton: React.FC<AddPageButtonProps> = ({
  onAddPage,
  position
}) => {
  const { colors, tokens } = useTheme();

  const getStyles = () => ({
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: tokens.spacing[4],
      margin: `${tokens.spacing[2]} 0`,
    },
    button: {
      backgroundColor: colors.surface,
      border: `2px dashed ${colors.outline}`,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[4],
      minWidth: '200px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.spacing[2],
    },
    buttonHover: {
      backgroundColor: colors.primaryContainer,
      borderColor: colors.primary,
      borderStyle: 'solid',
    },
    buttonText: {
      ...tokens.typography.body.medium,
      color: colors.onSurfaceVariant,
    },
    buttonTextHover: {
      color: colors.onPrimaryContainer,
    },
    icon: {
      fontSize: '20px',
      color: colors.onSurfaceVariant,
    },
    iconHover: {
      color: colors.onPrimaryContainer,
    }
  });

  const styles = getStyles();

  const handleClick = () => {
    onAddPage();
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = e.currentTarget;
    const icon = button.querySelector('.add-icon') as HTMLElement;
    const text = button.querySelector('.add-text') as HTMLElement;

    Object.assign(button.style, styles.buttonHover);
    if (icon) Object.assign(icon.style, styles.iconHover);
    if (text) Object.assign(text.style, styles.buttonTextHover);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = e.currentTarget;
    const icon = button.querySelector('.add-icon') as HTMLElement;
    const text = button.querySelector('.add-text') as HTMLElement;

    Object.assign(button.style, styles.button);
    if (icon) Object.assign(icon.style, styles.icon);
    if (text) Object.assign(text.style, styles.buttonText);
  };

  return (
    <div style={styles.container}>
      <div
        style={styles.button}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title={position === 'between' ? 'Add page here' : 'Add page at end'}
      >
        <span
          className="material-symbols-outlined add-icon"
          style={styles.icon}
        >
          add
        </span>
        <span className="add-text" style={styles.buttonText}>
          {position === 'between' ? 'Add Page Here' : 'Add New Page'}
        </span>
      </div>
    </div>
  );
};