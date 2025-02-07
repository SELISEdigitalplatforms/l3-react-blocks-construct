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
    <div className="flex w-full h-screen">
      <div className="hidden md:flex md:w-[36%] bg-primary-shade-50">
        <img
          src={getBackgroundImage()}
          alt="bg-auth"
          className="w-full h-full object-cover"
          key={theme ?? 'default'}
        />
      </div>
      <div className="flex items-center justify-center w-full px-6 sm:px-20 md:w-[64%] md:px-24 lg:px-50 xl:px-56">
        <Outlet />
      </div>
    </div>
  );
}
