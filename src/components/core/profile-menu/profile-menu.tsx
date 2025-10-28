import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui-kit/dropdown-menu';
import { useSignoutMutation } from '@/modules/auth/hooks/use-auth';
import { useAuthStore } from '@/state/store/auth';
import DummyProfile from '@/assets/images/dummy_profile.png';
import { Skeleton } from '@/components/ui-kit/skeleton';
import { useTheme } from '@/styles/theme/theme-provider';
import { useGetAccount } from '@/modules/profile/hooks/use-account';

/**
 * ProfileMenu Component
 *
 * A user profile dropdown menu component that displays user information and provides
 * navigation and account management options.
 *
 * Features:
 * - Displays user profile image and name
 * - Shows loading states with skeleton placeholders
 * - Provides navigation to profile page
 * - Includes theme toggling functionality
 * - Handles user logout with authentication state management
 * - Responsive design with different spacing for mobile and desktop
 *
 * Dependencies:
 * - Requires useTheme hook for theme management
 * - Requires useAuthStore for authentication state management
 * - Requires useSignoutMutation for API logout functionality
 * - Requires useGetAccount for fetching user account data
 * - Uses DropdownMenu components for the menu interface
 * - Uses React Router's useNavigate for navigation
 *
 * @example
 * // Basic usage in a header or navigation component
 * <ProfileMenu />
 */

export const ProfileMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const { logout } = useAuthStore();
  const { mutateAsync } = useSignoutMutation();
  const navigate = useNavigate();
  const { data, isLoading } = useGetAccount();

  const signoutHandler = async () => {
    try {
      const res = await mutateAsync();
      if (res.isSuccess) {
        logout();
        navigate('/login');
      }
    } catch (_error) {
      /* empty */
    }
  };

  const fullName = `${data?.firstName ?? ''} ${data?.lastName ?? ''}`.trim() ?? ' ';

  // Store user profile data in localStorage when it's available
  useEffect(() => {
    if (data) {
      localStorage.setItem(
        'userProfile',
        JSON.stringify({
          fullName,
          profileImageUrl: data.profileImageUrl || DummyProfile,
        })
      );
    }
  }, [data, fullName]);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild className="cursor-pointer p-1 rounded-[2px]">
        <div className="flex justify-between items-center gap-1 sm:gap-3 cursor-pointer">
          <div className="relative overflow-hidden rounded-full border shadow-sm border-white h-8 w-8">
            {isLoading ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : (
              <img
                src={
                  data?.profileImageUrl !== ''
                    ? (data?.profileImageUrl ?? DummyProfile)
                    : DummyProfile
                }
                alt="profile"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col">
            {isLoading ? (
              <Skeleton className="w-24 h-4 mb-1" />
            ) : (
              <h2 className="text-xs font-semibold text-high-emphasis">{fullName}</h2>
            )}
            <p className="text-[10px] text-low-emphasis capitalize">{t('ADMIN')}</p>
          </div>
          {isDropdownOpen ? (
            <ChevronUp className="h-5 w-5 text-medium-emphasis" />
          ) : (
            <ChevronDown className="h-5 w-5 text-medium-emphasis" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 text-medium-emphasis"
        align="end"
        side="top"
        sideOffset={10}
      >
        <DropdownMenuItem onClick={() => navigate('profile')}>{t('MY_PROFILE')}</DropdownMenuItem>
        <DropdownMenuItem disabled>{t('ABOUT')}</DropdownMenuItem>
        <DropdownMenuItem disabled>{t('PRIVACY_POLICY')}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex justify-between items-center transition-colors"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <span>{t('THEME')}</span>
          <button className="p-1 rounded-full transition-colors">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signoutHandler}>{t('LOG_OUT')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
