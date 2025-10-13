import { useState, useEffect } from 'react';
import { AdminService } from '../api';
import { UserAdminStatus, Organization } from '../types';

export const useAdminStatus = () => {
  const [adminStatus, setAdminStatus] = useState<UserAdminStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await AdminService.getAdminStatus();
      setAdminStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch admin status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStatus();
  }, []);

  const refetch = () => {
    fetchAdminStatus();
  };

  return {
    adminStatus,
    loading,
    error,
    refetch,
    isAdmin: adminStatus?.is_admin ?? false
  };
};

export const useSetDefaultOrganization = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setDefaultOrganization = async (organizationSlug: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await AdminService.setDefaultOrganization(organizationSlug);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set default organization');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    setDefaultOrganization,
    loading,
    error
  };
};