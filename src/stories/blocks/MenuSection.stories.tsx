import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';

// Mock simplified MenuSection component to demonstrate functionality
const MockMenuSection = ({ 
  title = 'Menu Section',
  items = [],
  showText = true,
  pathname = '/dashboard',
  isMobile = false,
  open = true,
  onItemClick
}: {
  title?: string;
  items?: Array<{
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
  }>;
  showText?: boolean;
  pathname?: string;
  isMobile?: boolean;
  open?: boolean;
  onItemClick?: () => void;
}) => {
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleItemClick = (item: any) => {
    // eslint-disable-next-line no-console
    console.log('Menu item clicked:', item.name);
    if (onItemClick) {
      onItemClick();
    }
  };

  const renderMenuItem = (item: any) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = pathname.includes(item.path);
    const isMenuOpen = openMenus[item.id];

    if (hasChildren) {
      return (
        <Collapsible key={item.id} open={isMenuOpen} onOpenChange={() => toggleMenu(item.id)}>
          <CollapsibleTrigger asChild>
            <div
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors w-full ${
                isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center justify-center w-6 h-6">
                <span className={`text-lg ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                  {item.icon}
                </span>
              </div>
              {showText && (
                <>
                  <span className={`ml-3 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                  <ChevronRight 
                    className={`ml-auto h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-90' : ''} ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`} 
                  />
                </>
              )}
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="ml-6 mt-1 space-y-1">
              {item.children?.map((child: any) => {
                const isChildActive = pathname.includes(child.path);
                return (
                  <div
                    key={child.id}
                    className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                      isChildActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleItemClick(child)}
                  >
                    <div className="flex items-center justify-center w-6 h-6">
                      <span className={`text-sm ${isChildActive ? 'text-blue-600' : 'text-gray-600'}`}>
                        {child.icon}
                      </span>
                    </div>
                    {showText && (
                      <span className={`ml-3 text-sm ${isChildActive ? 'text-blue-600' : 'text-gray-600'}`}>
                        {child.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <div
        key={item.id}
        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors w-full ${
          isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
        }`}
        onClick={() => handleItemClick(item)}
      >
        <div className="flex items-center justify-center w-6 h-6">
          <span className={`text-lg ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
            {item.icon}
          </span>
        </div>
        {showText && (
          <span className={`ml-3 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
            {item.name}
          </span>
        )}
      </div>
    );
  };

  return (
    <Router>
      <div className="space-y-2">
        {/* Section Title */}
        {showText && (
          <div className="px-2">
            <p className="text-xs font-medium uppercase text-gray-500 tracking-wide">
              {title}
            </p>
          </div>
        )}

        {/* Separator for collapsed state */}
        {!open && !isMobile && (
          <div className="px-2">
            <hr className="border-t border-gray-200" />
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-1">
          {items.map(item => renderMenuItem(item))}
        </div>
      </div>
    </Router>
  );
};

const meta: Meta<typeof MockMenuSection> = {
  title: 'Block Components/MenuSection',
  component: MockMenuSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A menu section component that groups related menu items under a common title. Supports both regular menu items and expandable items with children.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    showText: { control: 'boolean' },
    pathname: { control: 'text' },
    isMobile: { control: 'boolean' },
    open: { control: 'boolean' },
    onItemClick: { action: 'onItemClick' },
  },
  decorators: [
    (Story) => (
      <div className="w-64 bg-white border border-gray-200 rounded-lg p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MockMenuSection>;

const defaultItems = [
  { id: '1', name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { id: '2', name: 'Analytics', path: '/analytics', icon: '📈' },
  { id: '3', name: 'Settings', path: '/settings', icon: '⚙️' },
];

const itemsWithChildren = [
  { id: '1', name: 'Dashboard', path: '/dashboard', icon: '📊' },
  {
    id: '2',
    name: 'Users',
    path: '/users',
    icon: '👥',
    children: [
      { id: '2-1', name: 'All Users', path: '/users/all', icon: '👤' },
      { id: '2-2', name: 'User Roles', path: '/users/roles', icon: '🔐' },
      { id: '2-3', name: 'Permissions', path: '/users/permissions', icon: '🛡️' },
    ],
  },
  {
    id: '3',
    name: 'Content',
    path: '/content',
    icon: '📄',
    children: [
      { id: '3-1', name: 'Posts', path: '/content/posts', icon: '📝' },
      { id: '3-2', name: 'Pages', path: '/content/pages', icon: '📋' },
    ],
  },
  { id: '4', name: 'Settings', path: '/settings', icon: '⚙️' },
];

export const Default: Story = {
  args: {
    title: 'Navigation',
    items: defaultItems,
    showText: true,
    pathname: '/dashboard',
    isMobile: false,
    open: true,
  },
};

export const WithChildren: Story = {
  args: {
    title: 'Main Menu',
    items: itemsWithChildren,
    showText: true,
    pathname: '/users/roles',
    isMobile: false,
    open: true,
  },
};

export const CollapsedState: Story = {
  args: {
    title: 'Navigation',
    items: defaultItems,
    showText: false,
    pathname: '/dashboard',
    isMobile: false,
    open: false,
  },
};

export const MobileView: Story = {
  args: {
    title: 'Mobile Menu',
    items: itemsWithChildren,
    showText: true,
    pathname: '/analytics',
    isMobile: true,
    open: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const CloudIntegrated: Story = {
  args: {
    title: 'Cloud Integrated',
    items: [
      { id: '1', name: 'Dashboard', path: '/dashboard', icon: '📊' },
      { id: '2', name: 'Projects', path: '/projects', icon: '📁' },
      { id: '3', name: 'Deployments', path: '/deployments', icon: '🚀' },
      { id: '4', name: 'Monitoring', path: '/monitoring', icon: '📈' },
    ],
    showText: true,
    pathname: '/projects',
    isMobile: false,
    open: true,
  },
};

export const DesignOnly: Story = {
  args: {
    title: 'Design Only',
    items: [
      {
        id: '1',
        name: 'Components',
        path: '/components',
        icon: '🧩',
        children: [
          { id: '1-1', name: 'Buttons', path: '/components/buttons', icon: '🔘' },
          { id: '1-2', name: 'Forms', path: '/components/forms', icon: '📝' },
          { id: '1-3', name: 'Tables', path: '/components/tables', icon: '📋' },
        ],
      },
      { id: '2', name: 'Templates', path: '/templates', icon: '📄' },
      { id: '3', name: 'Style Guide', path: '/style-guide', icon: '🎨' },
    ],
    showText: true,
    pathname: '/components/buttons',
    isMobile: false,
    open: true,
  },
};

export const MultipleSections: Story = {
  render: (args) => (
    <div className="w-64 bg-white border border-gray-200 rounded-lg p-4 space-y-6">
      <MockMenuSection
        title="Cloud Integrated"
        items={[
          { id: '1', name: 'Dashboard', path: '/dashboard', icon: '📊' },
          { id: '2', name: 'Projects', path: '/projects', icon: '📁' },
        ]}
        showText={args.showText}
        pathname={args.pathname}
        isMobile={args.isMobile}
        open={args.open}
        onItemClick={args.onItemClick}
      />
      
      <MockMenuSection
        title="Design Only"
        items={[
          {
            id: '3',
            name: 'Components',
            path: '/components',
            icon: '🧩',
            children: [
              { id: '3-1', name: 'Buttons', path: '/components/buttons', icon: '🔘' },
              { id: '3-2', name: 'Forms', path: '/components/forms', icon: '📝' },
            ],
          },
          { id: '4', name: 'Templates', path: '/templates', icon: '📄' },
        ]}
        showText={args.showText}
        pathname={args.pathname}
        isMobile={args.isMobile}
        open={args.open}
        onItemClick={args.onItemClick}
      />
    </div>
  ),
  args: {
    showText: true,
    pathname: '/components/buttons',
    isMobile: false,
    open: true,
  },
  argTypes: {
    title: { table: { disable: true } },
    items: { table: { disable: true } },
  },
};