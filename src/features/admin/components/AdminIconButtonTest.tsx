import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../../../shared/components';

interface AdminIconButtonTestProps {
  style?: React.CSSProperties;
}

export const AdminIconButtonTest: React.FC<AdminIconButtonTestProps> = ({ style }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('Admin button clicked!');
    navigate('/admin/select-org');
  };

  return (
    <IconButton
      icon="settings"
      variant="filled"
      onClick={handleClick}
      style={{
        width: '56px',
        height: '56px',
        backgroundColor: 'orange', // Make it obvious
        ...style,
      }}
      data-testid="admin-icon-button-test"
    />
  );
};