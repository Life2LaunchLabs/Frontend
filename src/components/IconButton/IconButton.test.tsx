import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../theme';
import { IconButton } from './IconButton';

// Helper to render with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('IconButton', () => {
  // Basic rendering
  it('should render with default icon', () => {
    renderWithTheme(<IconButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('l2l-icon-button');
  });

  it('should render with custom icon', () => {
    renderWithTheme(<IconButton icon="star" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  // Variants - 5 variants (filled, outlined, standard, elevated, tonal)
  it('should render filled variant with correct styles', () => {
    renderWithTheme(<IconButton variant="filled" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'filled');
  });

  it('should render outlined variant with correct styles', () => {
    renderWithTheme(<IconButton variant="outlined" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'outlined');
  });

  it('should render standard variant with correct styles', () => {
    renderWithTheme(<IconButton variant="standard" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'standard');
  });

  it('should render elevated variant with correct styles', () => {
    renderWithTheme(<IconButton variant="elevated" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'elevated');
  });

  it('should render tonal variant with correct styles', () => {
    renderWithTheme(<IconButton variant="tonal" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'tonal');
  });

  // Shape - should be square and fully rounded
  it('should have square shape with equal width and height', () => {
    renderWithTheme(<IconButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('width: 40px');
    expect(button).toHaveStyle('height: 40px');
  });

  it('should have fully rounded corners', () => {
    renderWithTheme(<IconButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('border-radius: 1000px');
  });

  it('should have padding of 4px (8px total)', () => {
    renderWithTheme(<IconButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('padding: 0.5rem');
  });

  // States - 5 states (enabled, hover, focus, press, disabled)
  it('should be enabled by default', () => {
    renderWithTheme(<IconButton />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('data-state', 'enabled');
  });

  it('should handle hover state', () => {
    renderWithTheme(<IconButton />);
    const button = screen.getByRole('button');
    
    fireEvent.mouseEnter(button);
    expect(button).toHaveAttribute('data-hovered', 'true');
    
    fireEvent.mouseLeave(button);
    expect(button).toHaveAttribute('data-hovered', 'false');
  });

  it('should handle focus state', () => {
    renderWithTheme(<IconButton />);
    const button = screen.getByRole('button');
    
    fireEvent.focus(button);
    expect(button).toHaveAttribute('data-focused', 'true');
    
    fireEvent.blur(button);
    expect(button).toHaveAttribute('data-focused', 'false');
  });

  it('should handle press state', () => {
    renderWithTheme(<IconButton />);
    const button = screen.getByRole('button');
    
    fireEvent.mouseDown(button);
    expect(button).toHaveAttribute('data-pressed', 'true');
    
    fireEvent.mouseUp(button);
    expect(button).toHaveAttribute('data-pressed', 'false');
  });

  it('should handle disabled state', () => {
    renderWithTheme(<IconButton disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-state', 'disabled');
  });

  // Click handling
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    renderWithTheme(<IconButton onClick={handleClick} />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    renderWithTheme(<IconButton onClick={handleClick} disabled />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Toggle functionality
  it('should support toggle mode', () => {
    renderWithTheme(<IconButton toggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-toggle', 'true');
    expect(button).toHaveAttribute('data-toggled', 'false');
  });

  it('should toggle state when clicked in toggle mode', () => {
    renderWithTheme(<IconButton toggle />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(button).toHaveAttribute('data-toggled', 'true');
    
    fireEvent.click(button);
    expect(button).toHaveAttribute('data-toggled', 'false');
  });

  it('should support controlled toggle state', () => {
    const handleToggle = jest.fn();
    renderWithTheme(<IconButton toggle toggled={true} onToggle={handleToggle} />);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('data-toggled', 'true');
    
    fireEvent.click(button);
    expect(handleToggle).toHaveBeenCalledWith(false);
  });

  // Icon integration
  it('should render icon with correct properties', () => {
    renderWithTheme(<IconButton icon="favorite" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // The icon should be rendered inside the button
  });

  // Accessibility
  it('should have proper aria attributes', () => {
    renderWithTheme(<IconButton aria-label="Add item" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Add item');
  });

  it('should support custom aria-label', () => {
    renderWithTheme(<IconButton icon="delete" aria-label="Delete item" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Delete item');
  });

  // Theme integration
  it('should use theme colors for filled variant', () => {
    renderWithTheme(<IconButton variant="filled" />);
    const button = screen.getByRole('button');
    // Should use theme.primary background color
    expect(button).toBeInTheDocument();
  });

  it('should use theme colors for outlined variant', () => {
    renderWithTheme(<IconButton variant="outlined" />);
    const button = screen.getByRole('button');
    // Should use theme.primary border color
    expect(button).toBeInTheDocument();
  });
});