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
const lines = Array.from({ length: 20 }, (_, i) => `Line ${i + 1}`);

export const Basic: Story = {
  render: () => (
    <div className="h-64 w-64 border">
      <ScrollArea className="h-full w-full">
        <div className="h-96 w-96 bg-gradient-to-br from-purple-200 p-4">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

export {};
