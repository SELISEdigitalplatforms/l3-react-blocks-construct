import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ScrollArea } from '../../components/ui/scroll-area';

const meta: Meta<typeof ScrollArea> = {
  title: 'ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ScrollArea component built on Radix UI. Supports vertical and horizontal scrolling with custom styled scrollbars.',
      },
    },
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

/* -------------------- Basic -------------------- */
export const Basic: Story = {
  render: () => (
    <div className="h-64 w-64 border">
      <ScrollArea className="h-full w-full">
        <div className="h-96 w-96 bg-gradient-to-br from-purple-200 to-pink-200 p-4">
          {[...Array(20)].map((_, i) => (
            <p key={i}>Line {i + 1}</p>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

/* -------------------- HorizontalScroll -------------------- */
export const HorizontalScroll: Story = {
  render: () => (
    <div className="h-40 w-64 border">
      <ScrollArea className="h-full w-full">
        <div className="flex min-w-[800px] bg-gradient-to-r from-green-200 to-blue-200 p-4">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="mr-4 flex h-24 w-24 items-center justify-center rounded bg-white shadow"
            >
              Box {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

export {};
