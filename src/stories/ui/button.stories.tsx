import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button, ButtonProps } from '../../components/ui/button';
import { Mail, Plus } from 'lucide-react';

const meta: Meta<ButtonProps> = {
  title: 'Button',
  component: Button,
  parameters: {},
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Defines button style and visual prominence.',
      table: {
        type: { summary: 'enum(default, destructive, outline, secondary, ghost, link)' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Controls padding and font-size.',
      table: {
        type: { summary: 'enum(default, sm, lg, icon)' },
        defaultValue: { summary: 'default' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'If true, shows spinner / progress indicator; disables click.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'If true, button is not clickable; style communicates disabled state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    asChild: {
      control: false,
      table: { disable: true },
    },
    children: {
      description: 'The text displayed on the button. Should ideally be 1–3 words.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Default: Story = {
  args: {
    children: 'Button',
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

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
  },
  render: (args) => (
    <Button {...args}>
      <Plus className="h-4 w-4" />
    </Button>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <Mail className="mr-2 h-4 w-4" />
      Login with Email
    </Button>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Please wait',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};
