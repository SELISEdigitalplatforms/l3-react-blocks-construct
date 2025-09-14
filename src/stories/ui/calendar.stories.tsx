import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { Calendar } from '../../components/ui/calendar';
import { addDays } from 'date-fns';

// Define the meta with proper default export
const meta = {
  title: 'Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A simple calendar component for date selection.',
      },
    },
    layout: 'centered',
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'range', 'multiple'],
      description: 'The selection mode of the calendar.',
    },
    numberOfMonths: {
      control: 'number',
      description: 'The number of months to display at once.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the calendar is disabled.',
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof Calendar>;

// A simple single-day selection story with no state
export const Single: Story = {
  args: {
    mode: 'single',
    selected: new Date(),
    onSelect: () => console.log('Date selected'), // Added console.log instead of empty function
    className: 'rounded-md border',
  },
};

// A simple range selection story with no state
export const Range: Story = {
  args: {
    mode: 'range',
    selected: {
      from: new Date(),
      to: addDays(new Date(), 7),
    },
    numberOfMonths: 2,
    onSelect: () => console.log('Date range selected'), // Added console.log
    className: 'rounded-md border',
  },
};

// Wrapper component for state management
const CalendarWithState = (args: any) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [range, setRange] = useState<{ from: Date; to: Date | undefined } | undefined>({
    from: new Date(),
    to: addDays(new Date(), 5),
  });

  const stateProps =
    args.mode === 'single'
      ? {
          selected: date,
          onSelect: setDate,
        }
      : {
          selected: range,
          onSelect: setRange,
        };

  return <Calendar {...args} {...stateProps} />;
};

export const InteractiveExample: Story = {
  render: (args) => <CalendarWithState {...args} />,
  args: {
    mode: 'range',
    numberOfMonths: 2,
    className: 'rounded-md border',
  },
};

// The original "Fallback" story, fixed to use static data.
export const Fallback: Story = {
  args: {
    initialFocus: true,
    mode: 'range',
    defaultMonth: new Date(2024, 5, 1),
    selected: { from: new Date(2024, 5, 15), to: new Date(2024, 5, 22) },
    onSelect: () => console.log('Date selected in Fallback'), // Added console.log
    numberOfMonths: 2,
    className: 'rounded-md border',
  },
};
