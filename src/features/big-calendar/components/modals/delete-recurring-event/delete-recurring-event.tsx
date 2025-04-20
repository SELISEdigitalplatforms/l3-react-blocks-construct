import { useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group';
import { Label } from 'components/ui/label';

type DeleteOption = 'this' | 'thisAndFollowing' | 'all';

interface DeleteRecurringEventProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  onConfirm: (deleteOption: DeleteOption) => void;
}

/**
 * DeleteRecurringEvent Component
 *
 * A specialized alert dialog for handling the deletion of recurring events.
 * When deleting a recurring event, users need different options for how to handle the deletion:
 * delete just this instance, this and all future instances, or the entire series.
 *
 * Features:
 * - Presents three clear options for handling recurring event deletion
 * - Uses radio buttons for mutually exclusive selection
 * - Maintains the event title in the confirmation message
 * - Controlled dialog pattern with open/close state management
 * - Provides confirmation and cancellation actions
 *
 * Props:
 * - `open`: `{boolean}` – Controls whether the dialog is displayed
 * - `onOpenChange`: `{Function}` – Callback for when the dialog open state changes
 * - `eventTitle`: `{string}` – The title of the recurring event being deleted
 * - `onConfirm`: `{Function}` – Callback when the user confirms a deletion option
 *
 * @param {DeleteRecurringEventProps} props - Props for configuring the recurring event deletion dialog
 * @returns {JSX.Element} The rendered dialog component
 *
 * @example
 * <DeleteRecurringEvent
 *   open={showRecurringDeleteDialog}
 *   onOpenChange={setShowRecurringDeleteDialog}
 *   eventTitle="Weekly Team Meeting"
 *   onConfirm={(option) => handleRecurringDelete(eventId, option)}
 * />
 */
export function DeleteRecurringEvent({
  open,
  onOpenChange,
  eventTitle,
  onConfirm,
}: DeleteRecurringEventProps) {
  const [deleteOption, setDeleteOption] = useState<DeleteOption>('this');

  const handleConfirm = () => {
    onConfirm(deleteOption);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md z-[100]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">Delete recurring event?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold text-high-emphasis">{eventTitle}</span> is a recurring
            event. How would you like to delete it?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col w-full gap-3">
          <div className="flex items-center gap-3 w-full">
            <RadioGroup
              className="flex flex-col gap-3"
              value={deleteOption}
              onValueChange={(value) => setDeleteOption(value as DeleteOption)}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="this" id="status-this" />
                <Label htmlFor="status-this" className="cursor-pointer">
                  This event only
                </Label>
              </div>
              <div className="flex items-center gap-2 w-full">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="thisAndFollowing" id="status-following" />
                  <Label htmlFor="status-following" className="cursor-pointer">
                    This and following events
                  </Label>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="all" id="status-all" />
                  <Label htmlFor="status-all" className="cursor-pointer">
                    All events in the series
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-[6px]">Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-primary rounded-[6px]" onClick={handleConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
