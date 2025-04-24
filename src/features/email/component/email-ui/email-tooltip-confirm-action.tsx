import React, { useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from 'components/ui/tooltip';
import { useToast } from 'hooks/use-toast';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';

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
        title: 'Success',
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
