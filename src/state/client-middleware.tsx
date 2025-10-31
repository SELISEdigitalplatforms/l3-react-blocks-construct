import { ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { publicRoutes } from '@/constant/auth-public-routes';

/**
 * useAuthState Hook
 *
 * A custom hook that provides authentication state with mounting status tracking.
 * It synchronizes with the global auth store and ensures components can detect
 * when auth state is fully loaded.
 *
 * @returns {AuthState} An object containing authentication status information
 *   - isMounted: Whether the auth state has been initialized
 *   - isAuthenticated: Whether the user is authenticated
 *
 * @example
 * const { isMounted, isAuthenticated } = useAuthState();
 *
 * if (!isMounted) {
 *   return <LoadingSpinner />;
 * }
 *
 * return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
 */

interface AuthState {
  isMounted: boolean;
  isAuthenticated: boolean;
}

export const useAuthState = () => {
  const { isAuthenticated } = useAuthStore();
  const [isAuth, setIsAuth] = useState<AuthState>({
    isMounted: false,
    isAuthenticated: false,
  });

  useEffect(() => {
    setIsAuth({
      isMounted: true,
      isAuthenticated: isAuthenticated,
    });
  }, [isAuthenticated]);

  return isAuth;
};

/**
 * ClientMiddleware Component
 *
 * A protection layer that controls rendering based on authentication state,
 * automatically redirecting unauthenticated users away from protected routes.
 *
 * Features:
 * - Blocks access to protected routes for unauthenticated users
 * - Redirects to login page when authentication is required
 * - Allows access to public routes without authentication
 * - Prevents content flash by not rendering until auth state is confirmed
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render when access is granted
 * @returns {JSX.Element|null} The children when access is granted, null otherwise
 *
 * @example
 * <ClientMiddleware>
 *   <ProtectedRoutes />
 * </ClientMiddleware>
 */

interface ClientMiddlewareProps {
  children: ReactNode;
}

export const ClientMiddleware: React.FC<ClientMiddlewareProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { isMounted, isAuthenticated } = useAuthState();
  const isPublicRoute = publicRoutes.includes(currentPath);

  useLayoutEffect(() => {
    if (isMounted && !isAuthenticated && !isPublicRoute) {
      navigate('/login');
    }
  }, [isAuthenticated, isMounted, isPublicRoute, navigate]);

  if ((!isMounted || !isAuthenticated) && !isPublicRoute) return null;

  return <>{children}</>;
};
