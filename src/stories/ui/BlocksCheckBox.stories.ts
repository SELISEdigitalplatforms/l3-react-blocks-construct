import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Checkbox } from '../../components/ui/checkbox';
const meta: Meta<typeof Checkbox> = {
  title: 'UI Components/Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A custom styled checkbox component built using Radix UI CheckboxPrimitive with support for disabled state, focus ring, and checked indicator.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;
// ---------------------------
// Default unchecked
// ---------------------------
export const Default: Story = {
  args: {},
};
// ---------------------------
// Checked
// ---------------------------
export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};
// ---------------------------
// Disabled
// ---------------------------
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
// ---------------------------
// Checked & Disabled
// ---------------------------
export const CheckedDisabled: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
  },
};
