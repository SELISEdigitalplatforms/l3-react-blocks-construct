import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Input, InputProps } from '../../components/ui/input';

const meta: Meta<InputProps> = {
  title: 'Input',
  component: Input,
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when the input is empty.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input, preventing user interaction. ',
    },
    type: { control: 'text', description: 'The type of input, e.g., text, password, email.' },
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
