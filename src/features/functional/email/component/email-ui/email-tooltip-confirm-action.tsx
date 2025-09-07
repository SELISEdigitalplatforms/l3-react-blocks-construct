import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipTrigger, TooltipContent } from 'components/ui/tooltip';
import { useToast } from 'hooks/use-toast';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';

/**
 * TooltipConfirmAction Component
 *
 * A reusable component that wraps any trigger element (e.g., icon or button)
 * with a tooltip and a confirmation modal before performing a critical action.
 *
 * Features:
 * - Shows a tooltip on hover with helpful context
 * - Opens a confirmation modal when the trigger is clicked
 * - Executes a provided callback only upon confirmation
 * - Optionally displays a toast notification after confirmation
 *
 * Props:
 * @param {string} tooltipLabel - Text shown in the tooltip on hover
 * @param {string} confirmTitle - Title text for the confirmation modal
 * @param {string | React.ReactNode} confirmDescription - Description inside the confirmation modal
 * @param {() => void} onConfirm - Function called when the user confirms the action
 * @param {string} toastDescription - Text to show in the success toast after confirmation
 * @param {React.ReactElement} children - The trigger element (e.g., button/icon) to wrap
 *
 * @returns {JSX.Element} A component that includes a tooltip, confirmation modal, and optional toast
 *
 * @example
 * <TooltipConfirmAction
 *   tooltipLabel="Delete item"
 *   confirmTitle="Confirm Deletion"
 *   confirmDescription="Are you sure you want to delete this item?"
 *   onConfirm={handleDelete}
 *   toastDescription="Item deleted successfully"
 * >
 *   <TrashIcon />
 * </TooltipConfirmAction>
 */

interface TooltipConfirmActionProps {
  tooltipLabel: string;
  confirmTitle: string;
  confirmDescription: string | React.ReactNode;
  onConfirm: () => void;
  toastDescription: string;
  children: React.ReactElement;
}

const TooltipConfirmAction: React.FC<TooltipConfirmActionProps> = ({
  tooltipLabel,
  confirmTitle,
  confirmDescription,
  onConfirm,
  toastDescription,
  children,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const triggerElement = React.cloneElement(children, {
    onClick: handleClick,
  });

  const handleConfirm = () => {
    onConfirm();
    setShowConfirm(false);
    if (toastDescription) {
      toast({
        variant: 'success',
        title: t('SUCCESS'),
        description: toastDescription,
      });
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>{triggerElement}</TooltipTrigger>
        <TooltipContent className="bg-surface text-medium-emphasis" side="top" align="center">
          <p>{tooltipLabel}</p>
        </TooltipContent>
      </Tooltip>

      <ConfirmationModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={confirmTitle}
        description={confirmDescription}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default TooltipConfirmAction;
