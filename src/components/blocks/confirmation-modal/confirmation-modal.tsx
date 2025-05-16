import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'components/ui/alert-dialog';
import { Button } from 'components/ui/button';

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
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  /**
   * If true, the modal will not automatically close after confirmation.
   * The parent component is responsible for closing the modal if needed.
   * Default is false (modal will auto-close after confirmation).
   */
  preventAutoClose?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'CONFIRM',
  cancelText = 'CANCEL',
  preventAutoClose = false,
}) => {
  const { t } = useTranslation();

  const handleConfirmClick = () => {
    onConfirm();
    if (!preventAutoClose) {
      onOpenChange(false);
    }
  };
  const handleCancelClick = () => {
    onOpenChange(false);
  };

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
          <Button variant="outline" onClick={handleCancelClick} className="rounded-[6px]">
            {t(cancelText)}
          </Button>
          <Button
            variant="default"
            className="bg-primary rounded-[6px]"
            onClick={handleConfirmClick}
          >
            {t(confirmText)}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
