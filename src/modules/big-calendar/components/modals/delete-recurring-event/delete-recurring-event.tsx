import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui-kit/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui-kit/radio-group';
import { Label } from '@/components/ui-kit/label';
import { DELETE_UPDATE_RECURRING_EVENT_OPTIONS } from '@/modules/big-calendar/constants/calendar.constants';
import {
  DeleteUpdateEventOption,
  DeleteUpdateRecurringEventOption,
} from '@/modules/big-calendar/types/calendar-event.types';

interface DeleteRecurringEventProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  onConfirm: (deleteOption: DeleteUpdateEventOption) => void;
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
 * @example
 * <DeleteRecurringEvent
 *   open={showRecurringDeleteDialog}
 *   onOpenChange={setShowRecurringDeleteDialog}
 *   eventTitle="Weekly Team Meeting"
 *   onConfirm={(option) => handleRecurringDelete(eventId, option)}
 * />
 */
export const DeleteRecurringEvent = ({
  open,
  onOpenChange,
  eventTitle,
  onConfirm,
}: Readonly<DeleteRecurringEventProps>) => {
  const [deleteOption, setDeleteOption] = useState<DeleteUpdateEventOption>('this');
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm(deleteOption);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md z-[100]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">
            {t('DELETE_RECURRING_EVENT')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold text-high-emphasis">{eventTitle}</span>{' '}
            {t('DELETE_THIS_RECURRING_EVENT')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col w-full gap-3">
          <div className="flex items-center gap-3 w-full">
            <RadioGroup
              className="flex flex-col gap-3"
              value={deleteOption}
              onValueChange={(value) => setDeleteOption(value as DeleteUpdateEventOption)}
            >
              {DELETE_UPDATE_RECURRING_EVENT_OPTIONS.map(
                ({ value, labelKey }: DeleteUpdateRecurringEventOption) => (
                  <div key={value} className="flex items-center gap-2">
                    <RadioGroupItem value={value} id={`delete-option-${value}`} />
                    <Label htmlFor={`delete-option-${value}`} className="cursor-pointer">
                      {t(labelKey)}
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-[6px]">{t('CANCEL')}</AlertDialogCancel>
          <AlertDialogAction className="bg-primary rounded-[6px]" onClick={handleConfirm}>
            {t('DELETE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
