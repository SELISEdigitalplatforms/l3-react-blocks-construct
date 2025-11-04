import { UnauthorizedPage } from '@/modules/error-view/pages/unauthorized';
import { useIsProtected } from './use-is-protected';

type ProtectedRouteProps = {
  roles?: string[];
  permissions?: string[];
  opt?: 'all' | 'any';
  children: React.ReactNode;
};

export const ProtectedRoute = ({
  children,
  opt = 'any',
  roles = [],
  permissions = [],
}: ProtectedRouteProps) => {
  const { isProtected, isAuthenticated } = useIsProtected({ roles, permissions, opt });

  if (!isAuthenticated) throw new Error('Unauthenticated');

  if (!isProtected) return <UnauthorizedPage />;

  return <>{children}</>;
};
