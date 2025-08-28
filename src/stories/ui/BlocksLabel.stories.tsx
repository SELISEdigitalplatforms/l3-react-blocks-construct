import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';

const meta: Meta<typeof Label> = {
  title: 'UI Components/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders an accessible label associated with controls.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Your email address',
  },
};

export const WithInput: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label {...args} htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label {...args} htmlFor="terms">
        Accept terms and conditions
      </Label>
    </div>
  ),
};