import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from '../../components/ui/toast';
import { Button } from '../../components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';

const meta = {
  title: 'Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A toast component for displaying ephemeral notifications.',
      },
    },
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'info'],
      description: 'The visual style of the toast',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof Toast>;

// Toast Demo Component
const ToastDemo = ({
  variant,
  title,
  description,
  showAction,
  showClose,
}: {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  title: string;
  description: string;
  showAction?: boolean;
  showClose?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider>
      <Button onClick={() => setOpen(true)}>Show Toast</Button>

      <Toast variant={variant} open={open} onOpenChange={setOpen} className="min-w-[350px]">
        <div className="grid gap-1">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
        </div>
        {showAction && (
          <ToastAction asChild altText="Close toast">
            <Button variant="outline" size="sm">
              Close
            </Button>
          </ToastAction>
        )}
        {showClose && (
          <ToastClose>
            <Cross2Icon className="h-4 w-4" />
          </ToastClose>
        )}
      </Toast>

      <ToastViewport />
    </ToastProvider>
  );
};

// Default Toast
export const Default: Story = {
  render: () => (
    <ToastDemo
      variant="default"
      title="Default Toast"
      description="This is a default toast notification."
      showClose
    />
  ),
};

// Destructive Toast
export const Destructive: Story = {
  render: () => (
    <ToastDemo
      variant="destructive"
      title="Error Occurred"
      description="There was a problem with your request."
      showClose
    />
  ),
};

// Success Toast
export const Success: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Success!"
      description="Your action was completed successfully."
      showClose
    />
  ),
};

// Warning Toast
export const Warning: Story = {
  render: () => (
    <ToastDemo
      variant="warning"
      title="Warning"
      description="This action requires your attention."
      showClose
    />
  ),
};

// Info Toast
export const Info: Story = {
  render: () => (
    <ToastDemo
      variant="info"
      title="Information"
      description="Here's some important information for you."
      showClose
    />
  ),
};

// Toast with Action
export const WithAction: Story = {
  render: () => (
    <ToastDemo
      variant="default"
      title="Toast with Action"
      description="This toast includes an action button."
      showAction
      showClose
    />
  ),
};

// Toast without Close Button
export const WithoutClose: Story = {
  render: () => (
    <ToastDemo
      variant="default"
      title="Toast without Close"
      description="This toast will disappear automatically after a while."
    />
  ),
};

// Multiple Toasts Demo
const MultipleToastsDemo = () => {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      variant: 'default' | 'destructive' | 'success' | 'warning' | 'info';
      title: string;
      description: string;
    }>
  >([]);

  const addToast = (variant: 'default' | 'destructive' | 'success' | 'warning' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const titles = {
      default: 'Default Toast',
      destructive: 'Error Occurred',
      success: 'Success!',
      warning: 'Warning',
      info: 'Information',
    };

    const descriptions = {
      default: 'This is a default toast notification.',
      destructive: 'There was a problem with your request.',
      success: 'Your action was completed successfully.',
      warning: 'This action requires your attention.',
      info: "Here's some important information for you.",
    };

    setToasts((prev) => [
      ...prev,
      {
        id,
        variant,
        title: titles[variant],
        description: descriptions[variant],
      },
    ]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  return (
    <ToastProvider>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => addToast('default')}>Default</Button>
        <Button onClick={() => addToast('success')}>Success</Button>
        <Button onClick={() => addToast('warning')}>Warning</Button>
        <Button onClick={() => addToast('info')}>Info</Button>
        <Button variant="destructive" onClick={() => addToast('destructive')}>
          Error
        </Button>
      </div>

      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant}>
          <div className="grid gap-1">
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      ))}

      <ToastViewport />
    </ToastProvider>
  );
};

export const MultipleToasts: Story = {
  render: () => <MultipleToastsDemo />,
};

// Toast with Long Content
export const LongContent: Story = {
  render: () => (
    <ToastDemo
      variant="default"
      title="This is a toast with a very long title that might wrap to multiple lines"
      description="This is a very long description that should demonstrate how the toast component handles content that extends beyond a single line. The toast should expand appropriately to accommodate the content while maintaining proper padding and spacing."
      showClose
    />
  ),
};

// Custom Duration Toast
const CustomDurationDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider duration={10000}>
      {' '}
      {/* 10 seconds */}
      <Button onClick={() => setOpen(true)}>Show Toast (10s duration)</Button>
      <Toast open={open} onOpenChange={setOpen}>
        <div className="grid gap-1">
          <ToastTitle>Custom Duration</ToastTitle>
          <ToastDescription>
            This toast will stay visible for 10 seconds instead of the default duration.
          </ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};

export const CustomDuration: Story = {
  render: () => <CustomDurationDemo />,
};

// This empty export ensures the file is treated as a module
export {};
