import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../theme';
import { Button } from './Button';

// Helper to render with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('Button', () => {
  it('renders with default props', () => {
    renderWithTheme(<Button>Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveClass('l2l-button');
  });

  it('renders with default icon when no icon specified', () => {
    renderWithTheme(<Button>Add Item</Button>);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('add');
  });

  it('renders with custom icon', () => {
    renderWithTheme(<Button icon="star">Favorite</Button>);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveTextContent('star');
  });

  it('renders without icon when icon is false', () => {
    renderWithTheme(<Button icon={false}>No Icon</Button>);
    
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  describe('Button Styles', () => {
    it('renders filled style (default)', () => {
      renderWithTheme(<Button>Filled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('border-radius: 1000px');
      expect(button).toHaveStyle('padding: 10px 24px');
    });

    it('renders outlined style', () => {
      renderWithTheme(<Button variant="outlined">Outlined</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('border-width: 1px');
    });

    it('renders text style', () => {
      renderWithTheme(<Button variant="text">Text</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders elevated style', () => {
      renderWithTheme(<Button variant="elevated">Elevated</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)');
    });

    it('renders tonal style', () => {
      renderWithTheme(<Button variant="tonal">Tonal</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('border-radius: 1000px');
    });
  });

  describe('Button States', () => {
    it('handles enabled state', () => {
      renderWithTheme(<Button>Enabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('handles disabled state', () => {
      renderWithTheme(<Button disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveStyle('opacity: 0.4');
    });

    it('handles hover state', () => {
      renderWithTheme(<Button>Hover</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.mouseEnter(button);
      
      expect(button).toHaveAttribute('data-hovered', 'true');
    });

    it('handles focus state', () => {
      renderWithTheme(<Button>Focus</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.focus(button);
      
      expect(button).toHaveAttribute('data-focused', 'true');
    });

    it('handles pressed state', () => {
      renderWithTheme(<Button>Press</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.mouseDown(button);
      
      expect(button).toHaveAttribute('data-pressed', 'true');
    });

    it('resets pressed state on mouse up', () => {
      renderWithTheme(<Button>Press</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.mouseDown(button);
      fireEvent.mouseUp(button);
      
      expect(button).toHaveAttribute('data-pressed', 'false');
    });
  });

  describe('Icon and Text Layout', () => {
    it('renders icon and text with correct spacing', () => {
      renderWithTheme(<Button icon="star">Favorite</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('display: flex');
      expect(button).toHaveStyle('align-items: center');
      expect(button).toHaveStyle('gap: 8px');
    });

    it('renders only text when icon is false', () => {
      renderWithTheme(<Button icon={false}>Text Only</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Text Only');
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    });
  });

  describe('Click Handler', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      renderWithTheme(<Button onClick={handleClick}>Click</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      renderWithTheme(<Button onClick={handleClick} disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper button role', () => {
      renderWithTheme(<Button>Accessible</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      renderWithTheme(<Button aria-label="Custom label">Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });

    it('is keyboard accessible', () => {
      renderWithTheme(<Button>Keyboard</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });
  });
});