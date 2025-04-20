import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'components/ui/alert-dialog';

/**
 * ConfirmationModal Component
 *
 * A reusable modal dialog that prompts users to confirm or cancel an action.
 * Built using AlertDialog components for accessibility and consistent styling.
 *
 * Features:
 * - Controlled visibility state
 * - Customizable title and description
 * - Standardized cancel and confirm buttons
 * - Accessible design with proper ARIA attributes
 * - High z-index to ensure visibility above other UI elements
 * - Responsive layout with maximum width
 *
 * Props:
 * @param {boolean} open - Controls whether the modal is displayed
 * @param {(open: boolean) => void} onOpenChange - Callback when modal open state changes
 * @param {string} title - The title displayed in the modal header
 * @param {string} description - The descriptive text explaining the action to confirm
 * @param {() => void} onConfirm - Callback function executed when the user confirms the action
 *
 * @returns {JSX.Element} A confirmation modal dialog component
 *
 * @example
 * // Basic usage
 * <ConfirmationModal
 *   open={showDeleteDialog}
 *   onOpenChange={setShowDeleteDialog}
 *   title="Delete Item"
 *   description="Are you sure you want to delete this item? This action cannot be undone."
 *   onConfirm={handleDelete}
 * />
 */

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string | React.ReactNode;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md z-[100]" aria-describedby="alert-dialog-description">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-[6px]">Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-primary rounded-[6px]" onClick={onConfirm}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
