import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React, { useState } from 'react';
import ConfirmationModal, {
  ConfirmationModalProps,
} from '../../components/core/components/confirmation-modal/confirmation-modal';
import { Button } from '../../components/ui/button';
import DocsPage from './confirmation-modal.mdx';

const meta: Meta<ConfirmationModalProps> = {
  title: 'ConfirmationModal',
  component: ConfirmationModal,
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls the visibility of the modal.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    title: {
      control: 'text',
      description: 'The main heading displayed in the modal.',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: 'text',
      description: 'Additional information or context for the user.',
      table: {
        type: { summary: 'string' },
      },
    },
    confirmText: {
      control: 'text',
      description: 'Text for the confirm action button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Confirm' },
      },
    },
    cancelText: {
      control: 'text',
      description: 'Text for the cancel action button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Cancel' },
      },
    },
    preventAutoClose: {
      control: 'boolean',
      description: 'If true, the modal will not close automatically on confirm.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onOpenChange: {
      control: false,
      description: 'Callback fired when the modal open state changes.',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
    onConfirm: {
      control: false,
      description: 'Callback fired when the confirm button is clicked.',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<ConfirmationModalProps>;

const DefaultComponent = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Confirmation Modal</Button>
      <ConfirmationModal
        {...args}
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Confirm Action"
        description="Are you sure you want to proceed with this action?"
        onConfirm={() => {
          // eslint-disable-next-line no-console
          console.log('Confirmed!');
          alert('Action confirmed!');
        }}
      />
    </>
  );
};

export const Default: Story = {
  render: DefaultComponent,
  args: {
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed with this action?',
  },
};

const DeleteConfirmationComponent = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        Delete Item
      </Button>
      <ConfirmationModal
        {...args}
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={() => {
          // eslint-disable-next-line no-console
          console.log('Item deleted!');
          alert('Item deleted successfully!');
        }}
      />
    </>
  );
};

export const DeleteConfirmation: Story = {
  render: DeleteConfirmationComponent,
  args: {
    title: 'Delete Item',
    description: 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
  },
};

const CustomButtonsComponent = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Publish Article</Button>
      <ConfirmationModal
        {...args}
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={() => {
          // eslint-disable-next-line no-console
          console.log('Article published!');
          alert('Article published successfully!');
        }}
      />
    </>
  );
};

export const CustomButtons: Story = {
  render: CustomButtonsComponent,
  args: {
    title: 'Publish Article',
    description:
      'Your article will be published immediately and visible to all users. Are you ready to publish?',
    confirmText: 'Publish Now',
    cancelText: 'Save as Draft',
  },
};

const PreventAutoCloseComponent = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = () => {
    setIsProcessing(true);
    // Simulate async operation
    setTimeout(() => {
      setIsProcessing(false);
      setIsOpen(false);
      alert('Operation completed!');
    }, 2000);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Async Action</Button>
      <ConfirmationModal
        {...args}
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Processing Action"
        description={
          isProcessing
            ? 'Please wait while we process your request...'
            : 'This action will take a few seconds to complete. Do you want to continue?'
        }
        confirmText={isProcessing ? 'Processing...' : 'Start Process'}
        cancelText="Cancel"
        preventAutoClose={true}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export const PreventAutoClose: Story = {
  render: PreventAutoCloseComponent,
  args: {
    preventAutoClose: true,
  },
};

const LongContentComponent = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Terms and Conditions</Button>
      <ConfirmationModal
        {...args}
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={() => {
          // eslint-disable-next-line no-console
          console.log('Terms accepted!');
          alert('Terms and conditions accepted!');
        }}
      />
    </>
  );
};

export const LongContent: Story = {
  render: LongContentComponent,
  args: {
    title: 'Accept Terms and Conditions',
    description:
      'By proceeding, you agree to our terms of service, privacy policy, and cookie policy. This includes sharing your data with third-party partners for analytics and marketing purposes. You can revoke this consent at any time through your account settings.',
    confirmText: 'I Accept',
    cancelText: 'Cancel',
  },
};
