import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { MenuIcon, type IconName } from '../../components/core/menu-icon/menu-icon';

const meta: Meta<typeof MenuIcon> = {
  title: 'MenuIcon',
  component: MenuIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A reusable icon component that maps string names to Lucide icons. This abstraction allows for consistent icon usage throughout the application by referencing icons by name.',
      },
    },
  },
  argTypes: {
    name: {
      control: 'select',
      options: [
        'LayoutDashboard',
        'User',
        'ChevronRight',
        'FileUser',
        'Users',
        'Server',
        'Store',
        'CircleHelp',
        'Inbox',
        'FileClock',
        'Presentation',
        'Calendar',
        'History',
        'SearchX',
        'TriangleAlert',
        'ChartNoAxesCombined',
        'ReceiptText',
        'Folder',
        'MessageSquareText',
      ] as IconName[],
    },
    size: { control: 'number' },
    color: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof MenuIcon>;

export const Default: Story = {
  args: {
    name: 'LayoutDashboard',
  },
};

export const UserIcon: Story = {
  args: {
    name: 'User',
    size: 24,
  },
};

export const StoreIcon: Story = {
  args: {
    name: 'Store',
    size: 32,
    color: '#3b82f6',
  },
};

export const WarningIcon: Story = {
  args: {
    name: 'TriangleAlert',
    size: 24,
    color: '#ef4444',
  },
};

export const NavigationIcons: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <MenuIcon name="LayoutDashboard" size={20} />
      <MenuIcon name="Users" size={20} />
      <MenuIcon name="Store" size={20} />
      <MenuIcon name="ReceiptText" size={20} />
      <MenuIcon name="Calendar" size={20} />
      <MenuIcon name="Inbox" size={20} />
    </div>
  ),
};

export const AllIcons: Story = {
  render: () => {
    const iconNames: IconName[] = [
      'LayoutDashboard',
      'User',
      'ChevronRight',
      'FileUser',
      'Users',
      'Server',
      'Store',
      'CircleHelp',
      'Inbox',
      'FileClock',
      'Presentation',
      'Calendar',
      'History',
      'SearchX',
      'TriangleAlert',
      'ChartNoAxesCombined',
      'ReceiptText',
      'Folder',
      'MessageSquareText',
    ];

    return (
      <div className="grid grid-cols-6 gap-4 p-4">
        {iconNames.map((iconName) => (
          <div key={iconName} className="flex flex-col items-center gap-2">
            <MenuIcon name={iconName} size={24} />
            <span className="text-xs text-center">{iconName}</span>
          </div>
        ))}
      </div>
    );
  },
};
