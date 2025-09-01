import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { Button } from '../../components/ui/button';

const meta: Meta<typeof Tooltip> = {
  title: 'UI Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
      },
    },
  },
  render: (args) => (
    <TooltipProvider>
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {},
};

export const WithDelay: Story = {
  render: (args) => (
    <TooltipProvider delayDuration={800}>
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me (with delay)</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This tooltip has a longer delay</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Different_Sides: Story = {
  render: (args) => (
    <TooltipProvider>
      <div className="flex gap-4 flex-wrap">
        <Tooltip {...args}>
          <TooltipTrigger asChild>
            <Button variant="outline">Top</Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Top tooltip</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip {...args}>
          <TooltipTrigger asChild>
            <Button variant="outline">Right</Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Right tooltip</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip {...args}>
          <TooltipTrigger asChild>
            <Button variant="outline">Bottom</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Bottom tooltip</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip {...args}>
          <TooltipTrigger asChild>
            <Button variant="outline">Left</Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Left tooltip</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};