import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  Close,
} from '../../components/ui/popover';

const meta: Meta<typeof Popover> = {
  title: 'Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Popover component built on Radix UI. Supports a trigger, content, anchor, and close functionality. Can be aligned and offset as needed.',
      },
    },
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

/* -------------------- Basic -------------------- */
export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>This is a basic popover content.</p>
      </PopoverContent>
    </Popover>
  ),
};

/* -------------------- WithCloseButton -------------------- */
export const WithCloseButton: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Click Me</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex justify-between items-center">
          <span>Popover with a close button</span>
          <Close asChild>
            <Button size="sm">X</Button>
          </Close>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/* -------------------- WithAnchor -------------------- */
const WithAnchorPopover = () => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor />
      <PopoverTrigger asChild>
        <Button>Toggle Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>This popover uses an anchor for positioning.</p>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </PopoverContent>
    </Popover>
  );
};

export const WithAnchor: Story = {
  render: () => <WithAnchorPopover />,
};

export {};
