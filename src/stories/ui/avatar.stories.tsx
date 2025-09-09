import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'An image element with a fallback for representing the user.',
      },
    },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {},
};

export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://invalid-url.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Small: Story = {
  render: (args) => (
    <Avatar {...args} className="h-8 w-8">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback className="text-xs">CN</AvatarFallback>
    </Avatar>
  ),
};

export const Large: Story = {
  render: (args) => (
    <Avatar {...args} className="h-16 w-16">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback className="text-lg">CN</AvatarFallback>
    </Avatar>
  ),
};
