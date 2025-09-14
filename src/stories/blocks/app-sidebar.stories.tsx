import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../components/ui/collapsible';
import { ChevronRight } from 'lucide-react';

// Mock simplified AppSidebar component to demonstrate functionality
const MockAppSidebar = ({
  isCollapsed = false,
  isMobile = false,
  showCloudIntegrated = true,
  showDesignOnly = true,
}: {
  isCollapsed?: boolean;
  isMobile?: boolean;
  showCloudIntegrated?: boolean;
  showDesignOnly?: boolean;
}) => {
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const cloudIntegratedItems = [
    { id: '1', name: 'Dashboard', path: '/dashboard', icon: '📊', hasChildren: false },
    {
      id: '2',
      name: 'Users',
      path: '/users',
      icon: '👥',
      hasChildren: true,
      children: [
        { id: '2-1', name: 'All Users', path: '/users/all', icon: '👤' },
        { id: '2-2', name: 'User Roles', path: '/users/roles', icon: '🔐' },
      ],
    },
    { id: '3', name: 'Settings', path: '/settings', icon: '⚙️', hasChildren: false },
  ];

  const designOnlyItems = [
    {
      id: '4',
      name: 'Components',
      path: '/components',
      icon: '🧩',
      hasChildren: true,
      children: [
        { id: '4-1', name: 'Buttons', path: '/components/buttons', icon: '🔘' },
        { id: '4-2', name: 'Forms', path: '/components/forms', icon: '📝' },
      ],
    },
    { id: '5', name: 'Templates', path: '/templates', icon: '📄', hasChildren: false },
  ];

  const renderMenuItem = (item: any, showText: boolean) => {
    const isOpen = openMenus[item.id];

    if (item.hasChildren) {
      return (
        <Collapsible key={item.id} open={isOpen} onOpenChange={() => toggleMenu(item.id)}>
          <CollapsibleTrigger asChild>
            <div
              className={`flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer ${!showText && 'justify-center'}`}
            >
              <span className="text-lg">{item.icon}</span>
              {showText && (
                <>
                  <span className="ml-3 text-sm font-medium">{item.name}</span>
                  <ChevronRight
                    className={`ml-auto h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                  />
                </>
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ml-6 space-y-1">
              {item.children?.map((child: any) => (
                <div
                  key={child.id}
                  className={`flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer ${!showText && 'justify-center'}`}
                >
                  <span className="text-sm">{child.icon}</span>
                  {showText && <span className="ml-3 text-sm text-gray-600">{child.name}</span>}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <div
        key={item.id}
        className={`flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer ${!showText && 'justify-center'}`}
      >
        <span className="text-lg">{item.icon}</span>
        {showText && <span className="ml-3 text-sm font-medium">{item.name}</span>}
      </div>
    );
  };

  const showText = !isCollapsed || isMobile;

  let sidebarWidth: string;
  if (isMobile) {
    sidebarWidth = 'w-64';
  } else if (isCollapsed) {
    sidebarWidth = 'w-16';
  } else {
    sidebarWidth = 'w-64';
  }

  return (
    <Router>
      <div
        className={`${sidebarWidth} bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-200`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200">
          <div className={`flex items-center ${!showText && 'justify-center'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            {showText && <span className="ml-3 text-lg font-bold">Logo</span>}
            {isMobile && <button className="ml-auto text-gray-500 hover:text-gray-700">✕</button>}
          </div>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {showCloudIntegrated && (
            <div>
              {showText && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Cloud Integrated
                </h3>
              )}
              <div className="space-y-1">
                {cloudIntegratedItems.map((item) => renderMenuItem(item, showText))}
              </div>
            </div>
          )}

          {showDesignOnly && (
            <div>
              {showText && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Design Only
                </h3>
              )}
              <div className="space-y-1">
                {designOnlyItems.map((item) => renderMenuItem(item, showText))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
};

const meta: Meta<typeof MockAppSidebar> = {
  title: 'AppSidebar',
  component: MockAppSidebar,
  tags: ['!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'A responsive, collapsible sidebar navigation component that displays application menu items organized into integrated and design-only categories.',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    isCollapsed: { control: 'boolean' },
    isMobile: { control: 'boolean' },
    showCloudIntegrated: { control: 'boolean' },
    showDesignOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof MockAppSidebar>;

export const Default: Story = {
  args: {
    isCollapsed: false,
    isMobile: false,
    showCloudIntegrated: true,
    showDesignOnly: true,
  },
};

export const Collapsed: Story = {
  args: {
    isCollapsed: true,
    isMobile: false,
    showCloudIntegrated: true,
    showDesignOnly: true,
  },
};

export const Mobile: Story = {
  args: {
    isCollapsed: false,
    isMobile: true,
    showCloudIntegrated: true,
    showDesignOnly: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const CloudIntegratedOnly: Story = {
  args: {
    isCollapsed: false,
    isMobile: false,
    showCloudIntegrated: true,
    showDesignOnly: false,
  },
};

export const DesignOnlyMode: Story = {
  args: {
    isCollapsed: false,
    isMobile: false,
    showCloudIntegrated: false,
    showDesignOnly: true,
  },
};

export const InLayout: Story = {
  render: (args) => (
    <div className="flex h-screen bg-gray-50">
      <MockAppSidebar {...args} />
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Main Content Area</h1>
          <p className="text-gray-600 mb-6">
            This demonstrates how the sidebar would look in a typical application layout. Try
            toggling between collapsed and expanded states to see the responsive behavior.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-2">Feature Card 1</h2>
              <p className="text-gray-600">
                Content that would be displayed in the main application area.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-2">Feature Card 2</h2>
              <p className="text-gray-600">More content to show the layout structure.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  args: {
    isCollapsed: false,
    isMobile: false,
    showCloudIntegrated: true,
    showDesignOnly: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
};
