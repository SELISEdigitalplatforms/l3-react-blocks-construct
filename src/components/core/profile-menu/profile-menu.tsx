import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useGetAccount } from '@/modules/profile/hooks/use-account';

/**
 * ProfileMenu Component
 *
 * A user profile dropdown menu component that displays user information and provides
 * navigation and account management options.
 *
 * Features:
 * - Displays user profile image
 * - Shows loading states with skeleton placeholders
 * - Provides navigation to profile page
 * - Handles user logout with authentication state management
 *
 * Dependencies:
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
        <DropdownMenuItem onClick={signoutHandler}>{t('LOG_OUT')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
