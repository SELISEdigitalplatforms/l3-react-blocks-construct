import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Badge, BadgeProps } from '../../components/ui/badge';

const meta: Meta<BadgeProps> = {
  title: 'Badge',
  component: Badge,
  parameters: {},
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Defines the badge style (e.g., default, secondary, destructive, outline).',
    },
  },
};

export default meta;
type Story = StoryObj<BadgeProps>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};
