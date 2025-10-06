import type { Meta, StoryObj } from '@storybook/react-webpack5';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { Button } from '../../components/ui/button';

interface AlertDialogStoryProps {
  confirmText?: string;
  cancelText?: string;
  open?: boolean;
  onOpenChange?: boolean;
  defaultOpen?: boolean;
}

const meta: Meta<any> = {
  title: 'AlertDialog',
  component: AlertDialog,
  parameters: {},
  argTypes: {
    open: {
      description: 'Boolean controlling whether the dialog is visible.',
      control: 'boolean',
      table: { disable: false },
    },
    defaultOpen: {
      description: 'Boolean for uncontrolled default state.',
      control: 'boolean',
      table: { disable: false },
    },
    onOpenChange: {
      description: 'Callback when open state changes.',
      table: { disable: true },
    },
    confirmText: {
      description: 'Label for confirm button.',
      control: 'text',
    },
    cancelText: {
      description: 'Label for cancel button.',
      control: 'text',
    },
    onConfirm: {
      description: 'Callback executed on confirmation.',
      table: { disable: true },
    },
    onCancel: {
      description: 'Callback executed on cancellation.',
      table: { disable: true },
    },
  },
  render: ({ open, defaultOpen, confirmText, cancelText }) => (
    <AlertDialog open={open} defaultOpen={defaultOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText || 'Cancel'}</AlertDialogCancel>
          <AlertDialogAction>{confirmText || 'Continue'}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export default meta;
type Story = StoryObj<any>;

export const Default: Story = {
  args: {
    open: false,
    defaultOpen: false,
    confirmText: 'Continue',
    cancelText: 'Cancel',
  },
};

export const Destructive: Story = {
  args: {
    confirmText: 'Delete Account',
    cancelText: 'Cancel',
  },
  render: ({ confirmText, cancelText }: AlertDialogStoryProps) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your account? This action is permanent and cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
