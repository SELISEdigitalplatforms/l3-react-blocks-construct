import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';

// Mock simplified SidebarMenuItem component to demonstrate functionality
const MockSidebarMenuItem = ({ 
  item,
  showText = true,
  isActive = false 
}: {
  item: {
    id: string;
    name: string;
    path: string;
    icon: string;
    children?: Array<{
      id: string;
      name: string;
      path: string;
      icon: string;
    }>;
  };
  showText?: boolean;
  isActive?: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    console.log('Navigating to:', item.path);
  };

  const renderIcon = (iconName: string) => (
    <div className="flex items-center justify-center w-6 h-6">
      <span className={`text-lg ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
        {iconName}
      </span>
    </div>
  );

  if (hasChildren) {
    return (
      <Router>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <div 
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              onClick={handleClick}
            >
              {renderIcon(item.icon)}
              {showText && (
                <>
                  <span className={`ml-3 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                  <ChevronRight 
                    className={`ml-auto h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''} ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`} 
                  />
                </>
              )}
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="ml-6 mt-1 space-y-1">
              {item.children?.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => console.log('Navigating to child:', child.path)}
                >
                  {renderIcon(child.icon)}
                  {showText && (
                    <span className="ml-3 text-sm text-gray-600">
                      {child.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Router>
    );
  }

  return (
    <Router>
      <div
        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
          isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
        }`}
        onClick={handleClick}
      >
        {renderIcon(item.icon)}
        {showText && (
          <span className={`ml-3 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
            {item.name}
          </span>
        )}
      </div>
    </Router>
  );
};

const meta: Meta<typeof MockSidebarMenuItem> = {
  title: 'Block Components/SidebarMenuItem',
  component: MockSidebarMenuItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A flexible sidebar menu item component that supports single-level items and expandable menu items with children.',
      },
    },
  },
  argTypes: {
    showText: { control: 'boolean' },
    isActive: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="w-64 bg-white border border-gray-200 rounded-lg p-2">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MockSidebarMenuItem>;

const sampleItem = {
  id: '1',
  name: 'Dashboard',
  path: '/dashboard',
  icon: '📊',
};

const sampleItemWithChildren = {
  id: '2',
  name: 'Users',
  path: '/users',
  icon: '👥',
  children: [
    { id: '2-1', name: 'All Users', path: '/users/all', icon: '👤' },
    { id: '2-2', name: 'User Roles', path: '/users/roles', icon: '🔐' },
    { id: '2-3', name: 'Permissions', path: '/users/permissions', icon: '🛡️' },
  ],
};

export const Default: Story = {
  args: {
    item: sampleItem,
    showText: true,
    isActive: false,
  },
};

export const Active: Story = {
  args: {
    item: sampleItem,
    showText: true,
    isActive: true,
  },
};

export const WithChildren: Story = {
  args: {
    item: sampleItemWithChildren,
    showText: true,
    isActive: false,
  },
};

export const WithChildrenActive: Story = {
  args: {
    item: sampleItemWithChildren,
    showText: true,
    isActive: true,
  },
};

export const IconOnly: Story = {
  args: {
    item: sampleItem,
    showText: false,
    isActive: false,
  },
};

export const IconOnlyActive: Story = {
  args: {
    item: sampleItem,
    showText: false,
    isActive: true,
  },
};

export const IconOnlyWithChildren: Story = {
  args: {
    item: sampleItemWithChildren,
    showText: false,
    isActive: false,
  },
};

export const LongText: Story = {
  args: {
    item: {
      id: '3',
      name: 'Very Long Menu Item Name That Might Wrap',
      path: '/long-menu-item',
      icon: '📄',
    },
    showText: true,
    isActive: false,
  },
};

export const MultipleItems: Story = {
  render: (args) => (
    <div className="w-64 bg-white border border-gray-200 rounded-lg p-2 space-y-1">
      <MockSidebarMenuItem 
        item={{ id: '1', name: 'Dashboard', path: '/dashboard', icon: '📊' }}
        showText={args.showText}
        isActive={false}
      />
      <MockSidebarMenuItem 
        item={sampleItemWithChildren}
        showText={args.showText}
        isActive={true}
      />
      <MockSidebarMenuItem 
        item={{ id: '3', name: 'Settings', path: '/settings', icon: '⚙️' }}
        showText={args.showText}
        isActive={false}
      />
      <MockSidebarMenuItem 
        item={{ 
          id: '4', 
          name: 'Reports', 
          path: '/reports', 
          icon: '📈',
          children: [
            { id: '4-1', name: 'Analytics', path: '/reports/analytics', icon: '📊' },
            { id: '4-2', name: 'Export', path: '/reports/export', icon: '📤' },
          ]
        }}
        showText={args.showText}
        isActive={false}
      />
    </div>
  ),
  args: {
    showText: true,
  },
  argTypes: {
    item: { table: { disable: true } },
    isActive: { table: { disable: true } },
  },
};