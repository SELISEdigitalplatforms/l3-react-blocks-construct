import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button } from '../../components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '../../components/ui/sheet';

const meta: Meta<typeof Sheet> = {
  title: 'Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Sheet component built on Radix UI Dialog. Supports trigger, overlay, sliding content, header, footer, title, and description. Variants can slide from top, bottom, left, or right.',
      },
    },
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Basic: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Basic Sheet</SheetTitle>
          <SheetDescription>This is a simple sheet example.</SheetDescription>
        </SheetHeader>
        <div className="my-4">
          <p>Sheet content goes here. You can put forms, text, or any components.</p>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

// Add this at the end to make TS happy under --isolatedModules
export {};
