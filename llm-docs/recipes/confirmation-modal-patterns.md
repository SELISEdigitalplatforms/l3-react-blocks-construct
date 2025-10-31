# Recipe: Confirmation Modal Patterns

## What You'll Build
Standardized confirmation dialogs for destructive and important actions using Selise's ConfirmationModal

## Prerequisites
- React project initialized with Selise CLI:
  ```bash
  npm install -g @seliseblocks/cli
  blocks new web [PROJECT_NAME] --blocks-key [YOUR_BLOCKS_KEY] --app-domain [YOUR_APP_DOMAIN]
  ```
- Selise component library auto-included via CLI initialization

## The Component

### Import Path
```typescript
// Always use this component - never create custom confirmation dialogs
import ConfirmationModal from 'components/core/confirmation-modal/confirmation-modal'
```

### Component Props
```typescript
interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  onConfirm: () => void;
  confirmText?: string;           // Default: "CONFIRM"
  cancelText?: string;            // Default: "CANCEL"
  preventAutoClose?: boolean;     // Default: false
}
```

## Recipe Patterns

### Pattern 1: Basic Delete Confirmation
```typescript
import React, { useState } from 'react'
import ConfirmationModal from 'components/core/confirmation-modal/confirmation-modal'
import { Button } from 'components/ui/button'

export function BasicDeleteExample() {
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    item: null as { id: string; name: string } | null,
  });

  const handleDeleteClick = (item: { id: string; name: string }) => {
    setDeleteModal({ open: true, item });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.item) {
      // Perform delete operation
      console.log('Deleting:', deleteModal.item.id);
      // Modal will auto-close after confirmation
    }
  };

  return (
    <>
      <Button 
        variant="destructive" 
        onClick={() => handleDeleteClick({ id: '1', name: 'Test Item' })}
      >
        Delete Item
      </Button>

      <ConfirmationModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, item: null })}
        title="Delete Item"
        description={`Are you sure you want to delete "${deleteModal.item?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
```

### Pattern 2: Custom Button Text
```typescript
import React, { useState } from 'react'
import ConfirmationModal from 'components/core/confirmation-modal/confirmation-modal'

export function CustomButtonExample() {
  const [publishModal, setPublishModal] = useState({ open: false, draft: null });

  const handlePublish = () => {
    console.log('Publishing article...');
    // Auto-closes after confirmation
  };

  return (
    <ConfirmationModal
      open={publishModal.open}
      onOpenChange={(open) => setPublishModal({ open, draft: null })}
      title="Publish Article"
      description="Your article will be published immediately and visible to all users. Are you ready to publish?"
      confirmText="Publish Now"
      cancelText="Save as Draft"
      onConfirm={handlePublish}
    />
  );
}
```

### Pattern 3: Async Operations (Prevent Auto-Close)
```typescript
import React, { useState } from 'react'
import ConfirmationModal from 'components/core/confirmation-modal/confirmation-modal'

export function AsyncOperationExample() {
  const [processModal, setProcessModal] = useState({ open: false });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Operation completed!');
      
      // Manually close modal after success
      setProcessModal({ open: false });
    } catch (error) {
      console.error('Operation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ConfirmationModal
      open={processModal.open}
      onOpenChange={(open) => setProcessModal({ open })}
      title="Processing Action"
      description={
        isProcessing 
          ? "Please wait while we process your request..." 
          : "This action will take a few seconds to complete. Do you want to continue?"
      }
      confirmText={isProcessing ? "Processing..." : "Start Process"}
      cancelText="Cancel"
      preventAutoClose={true}  // Important: Prevents auto-close
      onConfirm={handleProcess}
    />
  );
}
```

### Pattern 4: Complex Content
```typescript
import React, { useState } from 'react'
import ConfirmationModal from 'components/core/confirmation-modal/confirmation-modal'

export function ComplexContentExample() {
  const [termsModal, setTermsModal] = useState({ open: false });

  const handleAcceptTerms = () => {
    console.log('Terms accepted');
    // Handle terms acceptance
  };

  const longDescription = `
    By proceeding, you agree to our terms of service, privacy policy, and cookie policy. 
    This includes sharing your data with third-party partners for analytics and marketing purposes. 
    You can revoke this consent at any time through your account settings.
  `;

  return (
    <ConfirmationModal
      open={termsModal.open}
      onOpenChange={(open) => setTermsModal({ open })}
      title="Accept Terms and Conditions"
      description={longDescription}
      confirmText="I Accept"
      cancelText="Cancel"
      onConfirm={handleAcceptTerms}
    />
  );
}
```

### Pattern 5: Integration with React Query Mutations
```typescript
import React, { useState } from 'react'
import ConfirmationModal from 'components/core/confirmation-modal/confirmation-modal'
import { useDeleteItem } from '../hooks/use-items'

export function ReactQueryIntegration() {
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    itemId: null as string | null,
    itemName: '',
  });

  const { mutate: deleteItem, isPending } = useDeleteItem();

  const handleDeleteConfirm = () => {
    if (deleteModal.itemId) {
      deleteItem(deleteModal.itemId, {
        onSuccess: () => {
          // Modal auto-closes on success due to React Query success handling
          setDeleteModal({ open: false, itemId: null, itemName: '' });
        },
        onError: (error) => {
          console.error('Delete failed:', error);
          // Keep modal open on error so user can retry
        }
      });
    }
  };

  return (
    <ConfirmationModal
      open={deleteModal.open}
      onOpenChange={(open) => setDeleteModal({ open, itemId: null, itemName: '' })}
      title="Delete Item"
      description={`Are you sure you want to delete "${deleteModal.itemName}"? This action cannot be undone.`}
      confirmText={isPending ? "Deleting..." : "Delete"}
      cancelText="Cancel"
      preventAutoClose={isPending}  // Prevent close while mutation is pending
      onConfirm={handleDeleteConfirm}
    />
  );
}
```

## Integration Patterns

### With Data Tables
```typescript
// In your table columns definition
{
  id: 'actions',
  header: 'Actions',
  cell: ({ row }) => {
    const item = row.original;
    return (
      <Button 
        size="sm" 
        variant="destructive" 
        onClick={() => setDeleteModal({ open: true, item })}
      >
        Delete
      </Button>
    );
  },
}

// In your component state
const [deleteModal, setDeleteModal] = useState<{
  open: boolean;
  item: YourItemType | null;
}>({ open: false, item: null });
```

### With Forms
```typescript
// Before form submission for critical actions
const handleFormSubmit = () => {
  if (isCriticalAction) {
    setConfirmationModal({ open: true, formData: data });
  } else {
    submitForm(data);
  }
};

const handleConfirmSubmit = () => {
  submitForm(confirmationModal.formData);
};
```

## Best Practices

### ✅ Always Use For
- Delete operations (any destructive action)
- Irreversible actions (publish, send email, etc.)
- Actions with significant consequences
- State changes that affect other users
- Operations that modify critical data

### ✅ Modal State Management
```typescript
// Good: Store relevant context
const [modal, setModal] = useState({
  open: false,
  item: null,      // Store the item being acted upon
  action: null,    // Store the action type if needed
});

// Good: Clear state when closing
onOpenChange={(open) => setModal({ open, item: null })}
```

### ✅ Description Best Practices
- Be specific about what will happen
- Mention if the action is irreversible
- Include the name/identifier of what's being affected
- Keep it concise but informative

### ❌ Don't Create Custom Confirmation Dialogs
- Always use the standard ConfirmationModal
- Don't build custom confirmation components
- Don't use regular dialogs for confirmation actions

## Component Features

### Built-in Accessibility
- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader compatible

### Built-in Styling
- Consistent with Selise design system
- Responsive design
- High z-index for proper layering
- Maximum width for readability

### Internationalization
- Uses react-i18next for translations
- Supports custom button text
- Handles complex text content

## Integration with Selise Architecture

This component is a **Block-level component** that:
- Can be used across all features
- Follows Selise design patterns
- Integrates with the translation system  
- Provides consistent user experience
- Should never be replaced with custom alternatives

Always import this component when you need confirmation dialogs - it's a core part of the Selise design system.