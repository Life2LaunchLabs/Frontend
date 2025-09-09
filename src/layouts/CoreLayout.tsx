import React from 'react';
import { BottomNavigation } from '../components/BottomNav';

export interface CoreLayoutProps {
  children: React.ReactNode;
}

export const CoreLayout: React.FC<CoreLayoutProps> = ({ children }) => {
  const containerStyles = {
    position: 'relative' as const,
    minHeight: '100vh'
  };

  const bottomNavStyles = {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  };

  return (
    <div style={containerStyles}>
      {children}
      
      <div style={bottomNavStyles}>
        <BottomNavigation />
      </div>
    </div>
  );
};