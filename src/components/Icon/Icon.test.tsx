import React from 'react';
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders with material symbol name and typography class', () => {
    render(<Icon name="star" typography="display-large" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('star');
    expect(icon).toHaveClass('l2l-icon');
  });

  it('renders with display-large typography (48dp/500)', () => {
    render(<Icon name="home" typography="display-large" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 48px');
    expect(icon).toHaveStyle('font-weight: 500');
  });

  it('renders with display-medium typography (48dp/500)', () => {
    render(<Icon name="home" typography="display-medium" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 48px');
    expect(icon).toHaveStyle('font-weight: 500');
  });

  it('renders with display-small typography (40dp/400)', () => {
    render(<Icon name="home" typography="display-small" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 40px');
    expect(icon).toHaveStyle('font-weight: 400');
  });

  it('renders with headline-large typography (48dp/400)', () => {
    render(<Icon name="home" typography="headline-large" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 48px');
    expect(icon).toHaveStyle('font-weight: 400');
  });

  it('renders with headline-medium typography (40dp/400)', () => {
    render(<Icon name="home" typography="headline-medium" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 40px');
    expect(icon).toHaveStyle('font-weight: 400');
  });

  it('renders with headline-small typography (40dp/300)', () => {
    render(<Icon name="home" typography="headline-small" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 40px');
    expect(icon).toHaveStyle('font-weight: 300');
  });

  it('renders with title-large typography (24dp/400)', () => {
    render(<Icon name="home" typography="title-large" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 24px');
    expect(icon).toHaveStyle('font-weight: 400');
  });

  it('renders with title-medium typography (24dp/400)', () => {
    render(<Icon name="home" typography="title-medium" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 24px');
    expect(icon).toHaveStyle('font-weight: 400');
  });

  it('renders with title-small typography (20dp/400)', () => {
    render(<Icon name="home" typography="title-small" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 20px');
    expect(icon).toHaveStyle('font-weight: 400');
  });

  it('renders with label-large typography (24dp/300)', () => {
    render(<Icon name="home" typography="label-large" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 24px');
    expect(icon).toHaveStyle('font-weight: 300');
  });

  it('renders with label-medium typography (20dp/300)', () => {
    render(<Icon name="home" typography="label-medium" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 20px');
    expect(icon).toHaveStyle('font-weight: 300');
  });

  it('renders with label-small typography (20dp/300)', () => {
    render(<Icon name="home" typography="label-small" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 20px');
    expect(icon).toHaveStyle('font-weight: 300');
  });

  it('renders with body-large typography (24dp/300)', () => {
    render(<Icon name="home" typography="body-large" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 24px');
    expect(icon).toHaveStyle('font-weight: 300');
  });

  it('renders with body-medium typography (20dp/300)', () => {
    render(<Icon name="home" typography="body-medium" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 20px');
    expect(icon).toHaveStyle('font-weight: 300');
  });

  it('renders with body-small typography (20dp/300)', () => {
    render(<Icon name="home" typography="body-small" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-size: 20px');
    expect(icon).toHaveStyle('font-weight: 300');
  });

  it('renders with default outlined style', () => {
    render(<Icon name="star" typography="display-large" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-variation-settings: "FILL" 0, "wght" 500, "GRAD" 0, "opsz" 48');
  });

  it('renders with filled style when active is true', () => {
    render(<Icon name="star" typography="display-large" active />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-variation-settings: "FILL" 1, "wght" 500, "GRAD" 0, "opsz" 48');
  });

  it('renders with outlined style when active is false', () => {
    render(<Icon name="star" typography="display-large" active={false} />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-variation-settings: "FILL" 0, "wght" 500, "GRAD" 0, "opsz" 48');
  });

  it('uses material symbols font family', () => {
    render(<Icon name="star" typography="display-large" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('font-family: "Material Symbols Outlined"');
  });
});