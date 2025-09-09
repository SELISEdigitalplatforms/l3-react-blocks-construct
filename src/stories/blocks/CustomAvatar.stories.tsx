import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CustomAvatar from '../../components/blocks/custom-avatar/custom-avatar';

const meta: Meta<typeof CustomAvatar> = {
  title: 'CustomAvatar',
  component: CustomAvatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'EmailAvatar component displays a user&apos;s avatar image in a circular frame with optional grid lines and customizable size.',
      },
    },
  },
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    width: { control: 'number' },
    height: { control: 'number' },
    showGrid: { control: 'boolean' },
    name: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof CustomAvatar>;

export const Default: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'User Avatar',
    name: 'John Doe',
  },
};

export const WithoutImage: Story = {
  args: {
    alt: 'User Avatar',
    name: 'Jane Smith',
  },
};

export const NoGrid: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'User Avatar',
    name: 'John Doe',
    showGrid: false,
  },
};

export const Large: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'User Avatar',
    name: 'John Doe',
    width: 80,
    height: 80,
  },
};

export const Small: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'User Avatar',
    name: 'John Doe',
    width: 32,
    height: 32,
  },
};

export const FallbackInitial: Story = {
  args: {
    alt: 'Unknown User',
    name: 'Anonymous User',
    width: 60,
    height: 60,
  },
};

export const EmptyName: Story = {
  args: {
    alt: 'Unknown User',
    name: '',
    width: 60,
    height: 60,
  },
};
