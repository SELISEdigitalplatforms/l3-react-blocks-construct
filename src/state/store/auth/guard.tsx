import { useGetAccount } from '@/modules/profile/hooks/use-account';
import { useAuthStore } from '.';
import { useEffect } from 'react';

export const Guard = ({ children }: { children: React.ReactNode }) => {
  const { data, isSuccess } = useGetAccount();
  const { setUser, isAuthenticated } = useAuthStore();
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isSuccess) return;
    setUser(data || null);
  }, [data, isAuthenticated, isSuccess, setUser]);

  return <>{children}</>;
};
