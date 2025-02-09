import { useLayoutEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthState } from '../../state/client-middleware';
import bgAuthLight from '../../assets/images/bg_auth_light.svg';
import bgAuthDark from '../../assets/images/bg_auth_dark.svg';
import { useTheme } from 'components/core/theme-provider';

export function AuthLayout() {
  const navigate = useNavigate();
  const { isMounted, isAuthenticated } = useAuthState();
  const { theme } = useTheme();

  useLayoutEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isMounted) return null;

  const getBackgroundImage = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? bgAuthDark : bgAuthLight;
    }
    return theme === 'dark' ? bgAuthDark : bgAuthLight;
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:block w-[32rem] relative bg-primary-shade-50">
        <img
          src={getBackgroundImage()}
          alt="bg-auth"
          className="w-full h-full object-cover"
          key={theme ?? 'default'}
        />
      </div>
      <div className="flex-1 flex justify-center items-center px-4">
        <div className="w-full max-w-[400px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
