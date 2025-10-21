import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React from 'react';
import { ErrorAlert } from '../../components/shared';

const meta: Meta<typeof ErrorAlert> = {
  title: 'ErrorAlert',
  component: ErrorAlert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A reusable alert component that displays error messages with automatic timeout functionality. The alert will automatically disappear after 5 seconds when an error is triggered.',
      },
    },
  },
  argTypes: {
    isError: { control: 'boolean' },
    title: { control: 'text' },
    message: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorAlert>;

export const Default: Story = {
  args: {
    isError: true,
  },
};

export const CustomMessage: Story = {
  args: {
    isError: true,
    title: 'Validation Error',
    message: 'Please check your form inputs and try again.',
  },
};

export const NetworkError: Story = {
  args: {
    isError: true,
    title: 'Network Error',
    message: 'Unable to connect to the server. Please check your internet connection.',
  },
};

export const AuthenticationError: Story = {
  args: {
    isError: true,
    title: 'Authentication Failed',
    message: 'Your session has expired. Please log in again.',
  },
};

export const Hidden: Story = {
  args: {
    isError: false,
    title: 'This Error',
    message: 'This error alert should not be visible.',
  },
};

const InteractiveComponent = (args: any) => {
  const [showError, setShowError] = React.useState(false);

  return (
    <div>
      <button
        onClick={() => setShowError(true)}
        className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Trigger Error
      </button>
      <ErrorAlert
        {...args}
        isError={showError}
        title="Interactive Error"
        message="This error was triggered by clicking the button above."
      />
    </div>
  );
};

export const Interactive: Story = {
  render: InteractiveComponent,
};
