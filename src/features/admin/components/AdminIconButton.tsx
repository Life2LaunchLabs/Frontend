import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../../../shared/components';
import { useAdminStatus } from '../hooks';

interface AdminIconButtonProps {
  style?: React.CSSProperties;
}

export const AdminIconButton: React.FC<AdminIconButtonProps> = ({ style }) => {
  const navigate = useNavigate();
  const { isAdmin, loading, adminStatus: _adminStatus } = useAdminStatus();


  // Don't render the button if user is not an admin or still loading
  if (loading || !isAdmin) {
    return null;
  }

  const handleClick = () => {
    navigate('/admin/select-org');
  };

  return (
    <IconButton
      icon="business"
      variant="filled"
      onClick={handleClick}
      style={{
        width: '56px',
        height: '56px',
        backgroundColor: 'white',
        ...style,
      }}
      data-testid="admin-icon-button"
    />
  );
};