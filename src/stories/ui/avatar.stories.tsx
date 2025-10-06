import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import React from 'react';

// Define a type for our custom controls
interface AvatarStoryProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
}

const meta: Meta<any> = {
  title: 'Avatar',
  component: Avatar,
  parameters: {},
  argTypes: {
    src: {
      control: 'text',
      description: 'Image URL.',
    },
    alt: {
      control: 'text',
      description: 'Accessible text description.',
    },
    fallback: {
      control: 'text',
      description: 'Content displayed if image fails to load.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Dimensions of the avatar.',
    },
    shape: {
      control: { type: 'select' },
      options: ['circle', 'square'],
      description: 'Avatar shape.',
    },
  },
  args: {
    src: 'https://github.com/shadcn.png',
    alt: '@shadcn',
    fallback: 'CN',
    size: 'md',
    shape: 'circle',
  },
  render: ({ src, alt, fallback, size = 'md', shape = 'circle' }) => (
    <Avatar
      className={`${size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-16 w-16' : 'h-10 w-10'} ${
        shape === 'square' ? 'rounded-md' : 'rounded-full'
      }`}
    >
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  ),
};

export default meta;
type Story = StoryObj<AvatarStoryProps>;

export const Default: Story = {};

export const Fallback: Story = {
  args: {
    src: 'https://invalid-url.png',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};
