import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { ChevronDown, Moon, Sun, User } from 'lucide-react';

// Simplified mock component that demonstrates the UProfileMenu functionality
const MockUProfileMenu = ({ 
  userName = "John Doe", 
  userEmail = "john.doe@example.com",
  profileImage,
  isLoading = false,
  theme = "light"
}: {
  userName?: string;
  userEmail?: string;
  profileImage?: string;
  isLoading?: boolean;
  theme?: 'light' | 'dark';
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [currentTheme, setCurrentTheme] = React.useState(theme);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  const handleProfileClick = () => {
    // eslint-disable-next-line no-console
    console.log('Navigate to profile page');
  };

  const handleLogout = () => {
    alert('Logged out successfully!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="space-y-1">
          <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
          <div className="w-16 h-2 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{userName}</div>
            <div className="text-xs text-gray-500 truncate">{userEmail}</div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
          {currentTheme === 'light' ? (
            <Moon className="mr-2 h-4 w-4" />
          ) : (
            <Sun className="mr-2 h-4 w-4" />
          )}
          <span>{currentTheme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const meta: Meta<typeof MockUProfileMenu> = {
  title: 'Block Components/UProfileMenu',
  component: MockUProfileMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A user profile dropdown menu component that displays user information and provides navigation and account management options.',
      },
    },
  },
  argTypes: {
    userName: { control: 'text' },
    userEmail: { control: 'text' },
    profileImage: { control: 'text' },
    isLoading: { control: 'boolean' },
    theme: { control: 'select', options: ['light', 'dark'] },
  },
};

export default meta;
type Story = StoryObj<typeof MockUProfileMenu>;

export const Default: Story = {
  args: {
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    profileImage: 'https://github.com/shadcn.png',
    theme: 'light',
  },
};

export const WithoutImage: Story = {
  args: {
    userName: 'Jane Smith',
    userEmail: 'jane.smith@company.com',
    theme: 'light',
  },
};

export const DarkMode: Story = {
  args: {
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    profileImage: 'https://github.com/shadcn.png',
    theme: 'dark',
  },
};

export const LongName: Story = {
  args: {
    userName: 'Dr. Alexander Maximilian Rodriguez-Thompson',
    userEmail: 'alexander.maximilian.rodriguez-thompson@verylongcompanyname.com',
    profileImage: 'https://github.com/shadcn.png',
    theme: 'light',
  },
};

export const Loading: Story = {
  args: {
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    isLoading: true,
  },
};

export const InNavbar: Story = {
  render: (args) => (
    <nav className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold text-gray-900">Dashboard</div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Welcome back!</span>
        <MockUProfileMenu {...args} />
      </div>
    </nav>
  ),
  args: {
    userName: 'Sarah Wilson',
    userEmail: 'sarah.wilson@company.com',
    profileImage: 'https://github.com/shadcn.png',
    theme: 'light',
  },
};