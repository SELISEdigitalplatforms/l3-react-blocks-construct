import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Slider } from '../../components/ui/slider';

const meta: Meta<typeof Slider> = {
  title: 'Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'An input where the user selects a value from within a given range.',
      },
    },
  },
  argTypes: {
    defaultValue: { control: 'object' },
    max: { control: 'number' },
    min: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    defaultValue: [33],
    max: 100,
    step: 1,
  },
  render: (args) => (
    <div className="w-full max-w-sm">
      <Slider {...args} />
    </div>
  ),
};

export const Range: Story = {
  args: {
    defaultValue: [33, 67],
    max: 100,
    step: 1,
  },
  render: (args) => (
    <div className="w-full max-w-sm">
      <Slider {...args} />
    </div>
  ),
};

export const WithStep: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 10,
  },
  render: (args) => (
    <div className="w-full max-w-sm">
      <Slider {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    disabled: true,
  },
  render: (args) => (
    <div className="w-full max-w-sm">
      <Slider {...args} />
    </div>
  ),
};
