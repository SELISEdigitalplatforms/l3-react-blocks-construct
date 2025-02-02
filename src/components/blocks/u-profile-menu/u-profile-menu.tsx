import { useState } from 'react';
import { ChevronDown, ChevronUp, Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { useSignoutMutation } from 'features/auth/hooks/use-auth';
import { useAuthStore } from 'state/store/auth';
import { useNavigate } from 'react-router-dom';
import DummyProfile from '../../../assets/images/dummy_profile.png';
import { Skeleton } from 'components/ui/skeleton';
import { useGetAccount } from 'features/profile/hooks/use-account';
import { useTheme } from 'components/core/theme-provider';

export const UProfileMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const { logout } = useAuthStore();
  const { mutateAsync } = useSignoutMutation();
  const navigate = useNavigate();
  const { data, isLoading, isFetching } = useGetAccount();

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

  const fullName = `${data?.firstName || ''} ${data?.lastName || ''}`.trim() || ' ';
  const loading = isLoading || isFetching;

  return (
    <DropdownMenu onOpenChange={(open) => setIsDropdownOpen(open)}>
      <DropdownMenuTrigger asChild className="cursor-pointer p-1 rounded-[2px]">
        <div className="flex justify-between items-center gap-3 cursor-pointer">
          <div className="relative overflow-hidden rounded-full border shadow-sm border-white h-8 w-8">
            {loading ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : (
              <img
                src={data?.profileImageUrl || DummyProfile}
                alt="profile pic"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col">
            {loading ? (
              <Skeleton className="w-24 h-4 mb-1" />
            ) : (
              <h2 className="text-xs font-semibold text-high-emphasis">{fullName}</h2>
            )}
            <p className="text-[10px] text-low-emphasis capitalize">Admin</p>
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
        <DropdownMenuItem onClick={() => navigate('profile')}>My Profile</DropdownMenuItem>
        <DropdownMenuItem disabled>About</DropdownMenuItem>
        <DropdownMenuItem disabled>Privacy Policy</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex justify-between items-center cursor-pointer transition-colors"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <span>Theme</span>
          <button className="p-1 rounded-full transition-colors">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signoutHandler}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
