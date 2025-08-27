import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Input, InputProps } from 'components/ui/input';

const meta: Meta<InputProps> = {
  title: 'UI/Input',

  component: Input,
  tags: ['autodocs'],

  argTypes: {
    placeholder: { control: 'text' },

    disabled: { control: 'boolean' },

    type: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<InputProps>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',

    disabled: false,

    type: 'text',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',

    disabled: true,

    type: 'text',
  },
};

export const Password: Story = {
  args: {
    placeholder: 'Enter password',

    type: 'password',
  },
};
