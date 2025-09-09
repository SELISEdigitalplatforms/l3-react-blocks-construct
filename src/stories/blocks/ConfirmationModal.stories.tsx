import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React, { useState } from 'react';
import ConfirmationModal from '../../components/blocks/confirmation-modal/confirmation-modal';
import { Button } from '../../components/ui/button';

const meta: Meta<typeof ConfirmationModal> = {
  title: 'ConfirmationModal',
  component: ConfirmationModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A reusable modal dialog that prompts users to confirm or cancel an action. Built using AlertDialog components for accessibility and consistent styling.',
      },
    },
  },
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
    confirmText: { control: 'text' },
    cancelText: { control: 'text' },
    preventAutoClose: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmationModal>;

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
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
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
        title="Publish Article"
        description="Your article will be published immediately and visible to all users. Are you ready to publish?"
        confirmText="Publish Now"
        cancelText="Save as Draft"
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
        title="Accept Terms and Conditions"
        description="By proceeding, you agree to our terms of service, privacy policy, and cookie policy. This includes sharing your data with third-party partners for analytics and marketing purposes. You can revoke this consent at any time through your account settings."
        confirmText="I Accept"
        cancelText="Cancel"
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
};
