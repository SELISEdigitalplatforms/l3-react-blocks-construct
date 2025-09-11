import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Textarea, TextareaProps } from '../../components/ui/textarea';

const meta: Meta<TextareaProps> = {
  title: 'UI Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Displays a form textarea or a component that looks like a textarea.',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
    height: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<TextareaProps>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message here.',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Type your message here.',
    disabled: true,
  },
};

export const WithRows: Story = {
  args: {
    placeholder: 'Type your message here.',
    rows: 4,
  },
};

export const WithHeight: Story = {
  args: {
    placeholder: 'Type your message here.',
    height: '100px',
  },
};