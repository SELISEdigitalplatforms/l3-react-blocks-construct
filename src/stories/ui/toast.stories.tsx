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

// Define a type alias for the variant union
type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

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

function ToastContent({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid gap-1">
      <ToastTitle>{title}</ToastTitle>
      <ToastDescription>{description}</ToastDescription>
    </div>
  );
}

function ToastDemo({
  variant,
  title,
  description,
  showAction,
  showClose,
}: {
  variant?: ToastVariant;
  title: string;
  description: string;
  showAction?: boolean;
  showClose?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider>
      <Button onClick={() => setOpen(true)}>Show Toast</Button>
      <Toast variant={variant} open={open} onOpenChange={setOpen} className="min-w-[350px]">
        <ToastContent title={title} description={description} />
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
}

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

export const WithoutClose: Story = {
  render: () => (
    <ToastDemo
      variant="default"
      title="Toast without Close"
      description="This toast will disappear automatically after a while."
    />
  ),
};

function MultipleToastButtons({ addToast }: { addToast: (variant: ToastVariant) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => addToast('default')}>Default</Button>
      <Button onClick={() => addToast('success')}>Success</Button>
      <Button onClick={() => addToast('warning')}>Warning</Button>
      <Button onClick={() => addToast('info')}>Info</Button>
      <Button variant="destructive" onClick={() => addToast('destructive')}>
        Error
      </Button>
    </div>
  );
}

function MultipleToastsDemo() {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      variant: ToastVariant;
      title: string;
      description: string;
    }>
  >([]);

  const addToast = (variant: ToastVariant) => {
    const id = crypto.randomUUID();
    setToasts((toasts) => [
      ...toasts,
      { id, variant, title: 'Toast Title', description: 'Toast Description' },
    ]);
  };

  return (
    <ToastProvider>
      <MultipleToastButtons addToast={addToast} />
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant}>
          <ToastContent title={toast.title} description={toast.description} />
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

export const MultipleToasts: Story = {
  render: () => <MultipleToastsDemo />,
};

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

function CustomDurationDemo() {
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider duration={10000}>
      <Button onClick={() => setOpen(true)}>Show Toast (10s duration)</Button>
      <Toast open={open} onOpenChange={setOpen}>
        <ToastContent
          title="Custom Duration"
          description="This toast will stay visible for 10 seconds instead of the default duration."
        />
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

export const CustomDuration: Story = {
  render: () => <CustomDurationDemo />,
};
