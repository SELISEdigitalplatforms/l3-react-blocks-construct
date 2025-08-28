import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React from 'react';
import { X } from 'lucide-react';

// Mock simplified LogoSection component to demonstrate functionality
const MockLogoSection = ({ 
  theme = 'light',
  open = true,
  isMobile = false,
  onClose
}: {
  theme?: 'light' | 'dark';
  open?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}) => {
  const handleClose = () => {
    // eslint-disable-next-line no-console
    console.log('Close sidebar clicked');
    if (onClose) {
      onClose();
    }
  };

  const logoText = 'CONSTRUCT';
  const logoIcon = 'C';

  return (
    <div className="relative h-10 w-full bg-white">
      {/* Full Logo - shown when open */}
      <div
        className={`absolute left-4 top-1 h-8 flex items-center transition-all duration-300 ${
          open || isMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className={`w-6 h-6 rounded flex items-center justify-center mr-2 ${
          theme === 'dark' ? 'bg-white text-black' : 'bg-blue-600 text-white'
        }`}>
          <span className="text-sm font-bold">{logoIcon}</span>
        </div>
        <span className={`text-lg font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {logoText}
        </span>
      </div>

      {/* Small Logo - shown when collapsed */}
      <div
        className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          open || isMobile ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className={`w-5 h-5 rounded flex items-center justify-center ${
          theme === 'dark' ? 'bg-white text-black' : 'bg-blue-600 text-white'
        }`}>
          <span className="text-xs font-bold">{logoIcon}</span>
        </div>
      </div>

      {/* Close Button - shown on mobile */}
      {isMobile && (
        <button
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 ${
            theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-600'
          }`}
          onClick={handleClose}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

const meta: Meta<typeof MockLogoSection> = {
  title: 'Block Components/LogoSection',
  component: MockLogoSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A responsive logo section component that displays different logo variants based on sidebar state and theme. Shows full logo when expanded and compact logo when collapsed.',
      },
    },
  },
  argTypes: {
    theme: { control: 'select', options: ['light', 'dark'] },
    open: { control: 'boolean' },
    isMobile: { control: 'boolean' },
    onClose: { action: 'onClose' },
  },
  decorators: [
    (Story, context) => (
      <div 
        className={`w-64 border rounded-lg p-2 ${
          context.args.theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}
        style={{ minHeight: '60px' }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MockLogoSection>;

export const Default: Story = {
  args: {
    theme: 'light',
    open: true,
    isMobile: false,
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    open: true,
    isMobile: false,
  },
};

export const Collapsed: Story = {
  args: {
    theme: 'light',
    open: false,
    isMobile: false,
  },
};

export const CollapsedDark: Story = {
  args: {
    theme: 'dark',
    open: false,
    isMobile: false,
  },
};

export const Mobile: Story = {
  args: {
    theme: 'light',
    open: true,
    isMobile: true,
  },
};

export const MobileDark: Story = {
  args: {
    theme: 'dark',
    open: true,
    isMobile: true,
  },
};

const InteractiveComponent = (args: any) => {
  const [isOpen, setIsOpen] = React.useState(args.open);
  const [currentTheme, setCurrentTheme] = React.useState(args.theme);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          {isOpen ? 'Collapse' : 'Expand'}
        </button>
        <button
          onClick={() => setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
        >
          Toggle Theme
        </button>
      </div>
      <div 
        className={`w-64 border rounded-lg p-2 transition-colors ${
          currentTheme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}
        style={{ minHeight: '60px' }}
      >
        <MockLogoSection
          {...args}
          theme={currentTheme}
          open={isOpen}
          onClose={() => {
            // eslint-disable-next-line no-console
            console.log('Close clicked');
          }}
        />
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: InteractiveComponent,
  args: {
    theme: 'light',
    open: true,
    isMobile: false,
  },
};

export const ResponsiveDemo: Story = {
  render: (args) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Desktop - Expanded</h3>
        <div className="w-64 bg-white border rounded-lg p-2" style={{ minHeight: '60px' }}>
          <MockLogoSection {...args} open={true} isMobile={false} />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Desktop - Collapsed</h3>
        <div className="w-16 bg-white border rounded-lg p-2" style={{ minHeight: '60px' }}>
          <MockLogoSection {...args} open={false} isMobile={false} />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Mobile</h3>
        <div className="w-64 bg-white border rounded-lg p-2" style={{ minHeight: '60px' }}>
          <MockLogoSection {...args} open={true} isMobile={true} />
        </div>
      </div>
    </div>
  ),
  args: {
    theme: 'light',
  },
  argTypes: {
    open: { table: { disable: true } },
    isMobile: { table: { disable: true } },
  },
};