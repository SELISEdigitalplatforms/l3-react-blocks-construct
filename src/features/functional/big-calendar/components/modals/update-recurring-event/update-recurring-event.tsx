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
} from 'components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group';
import { Label } from 'components/ui/label';

type UpdateOption = 'this' | 'thisAndFollowing' | 'all';

interface UpdateRecurringEventProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  onConfirm: (updateOption: UpdateOption) => void;
}

interface RadioOption {
  value: UpdateOption;
  labelKey: string;
}

// Constants to eliminate magic strings
const RADIO_OPTIONS: RadioOption[] = [
  { value: 'this', labelKey: 'THIS_EVENT_ONLY' },
  { value: 'thisAndFollowing', labelKey: 'THIS_AND_FOLLOWING_EVENTS' },
  { value: 'all', labelKey: 'ALL_EVENTS_SERIES' },
];

const BUTTON_CLASSES = 'rounded-[6px]';
const DEFAULT_UPDATE_OPTION: UpdateOption = 'this';

/**
 * UpdateRecurringEvent Component
 *
 * A specialized alert dialog for handling the update of recurring events.
 * When updating a recurring event, users need different options for how to handle the update:
 * update just this instance, this and all future instances, or the entire series.
 *
 * Features:
 * - Presents three clear options for handling recurring event updates
 * - Uses radio buttons for mutually exclusive selection
 * - Maintains the event title in the confirmation message
 * - Controlled dialog pattern with open/close state management
 * - Provides confirmation and cancellation actions
 *
 * Props:
 * - `open`: `{boolean}` – Controls whether the dialog is displayed
 * - `onOpenChange`: `{Function}` – Callback for when the dialog open state changes
 * - `eventTitle`: `{string}` – The title of the recurring event being updated
 * - `onConfirm`: `{Function}` – Callback when the user confirms an update option
 *
 * @param {UpdateRecurringEventProps} props - Props for configuring the recurring event update dialog
 * @returns {JSX.Element} The rendered dialog component
 *
 * @example
 * <UpdateRecurringEvent
 *   open={showRecurringUpdateDialog}
 *   onOpenChange={setShowRecurringUpdateDialog}
 *   eventTitle="Weekly Team Meeting"
 *   onConfirm={(option) => handleRecurringUpdate(eventId, option)}
 * />
 */
export function UpdateRecurringEvent({
  open,
  onOpenChange,
  eventTitle,
  onConfirm,
}: Readonly<UpdateRecurringEventProps>) {
  const { t } = useTranslation();
  const [updateOption, setUpdateOption] = useState<UpdateOption>(DEFAULT_UPDATE_OPTION);

  const handleConfirm = () => {
    onConfirm(updateOption);
    onOpenChange(false);
  };

  const handleValueChange = (value: string) => {
    setUpdateOption(value as UpdateOption);
  };

  const renderRadioOption = ({ value, labelKey }: RadioOption) => {
    const radioId = `status-${value}`;

    return (
      <div key={value} className="flex items-center gap-2">
        <RadioGroupItem value={value} id={radioId} />
        <Label htmlFor={radioId} className="cursor-pointer">
          {t(labelKey)}
        </Label>
      </div>
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md z-[100]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">
            {t('UPDATE_RECURRING_EVENT')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold text-high-emphasis">{eventTitle}</span>{' '}
            {t('RECURRING_EVENT_LIKE_UPDATE_IT')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col w-full gap-3">
          <div className="flex items-center gap-3 w-full">
            <RadioGroup
              className="flex flex-col gap-3"
              value={updateOption}
              onValueChange={handleValueChange}
            >
              {RADIO_OPTIONS.map(renderRadioOption)}
            </RadioGroup>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className={BUTTON_CLASSES}>{t('CANCEL')}</AlertDialogCancel>
          <AlertDialogAction className={`bg-primary ${BUTTON_CLASSES}`} onClick={handleConfirm}>
            {t('UPDATE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
