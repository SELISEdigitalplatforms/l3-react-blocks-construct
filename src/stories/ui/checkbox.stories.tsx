import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Checkbox } from '../../components/ui/checkbox';
const meta: Meta<typeof Checkbox> = {
  title: 'Checkbox',
  component: Checkbox,
  parameters: {},
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Boolean indicating current state.',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Default state for uncontrolled checkboxes.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction.',
    },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const CheckedDisabled: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
  },
};
