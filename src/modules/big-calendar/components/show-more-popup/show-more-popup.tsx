import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui-kit/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui-kit/popover';
import { CalendarEvent } from '../../types/calendar-event.types';
import { getTextColorClassFromBg } from '../../utils/date-utils';

interface ShowMorePopupProps {
  count: number;
  remainingEvents: CalendarEvent[];
  onClose?: () => void;
}

/**
 * ShowMorePopup Component
 *
 * A popover-based component that displays additional calendar events when the "+X more" label is clicked.
 * It shows a list of remaining events for a specific date, styled with dynamic colors based on each event's resource.
 *
 * Features:
 * - Displays the count of hidden events as "+X more".
 * - Shows a popover with a list of remaining events for the selected date.
 * - Dynamically applies background and text colors to each event based on its resource color.
 * - Includes a close button to dismiss the popover.
 *
 * Props:
 * - `count`: `{number}` – The number of hidden events to display in the "+X more" label.
 * - `remainingEvents`: `{CalendarEvent[]}` – An array of calendar events to display in the popover.
 * - `onClose`: `{Function}` (optional) – Callback triggered when the popover is closed.
 *
 * @param {ShowMorePopupProps} props - The props for configuring the "Show More" popup.
 *
 * @example
 * <ShowMorePopup
 *   count={3}
 *   remainingEvents={[
 *     {
 *       eventId: '1',
 *       title: 'Team Meeting',
 *       start: new Date('2023-10-01T09:00:00'),
 *       resource: { color: '#FF5733' },
 *     },
 *     {
 *       eventId: '2',
 *       title: 'Client Call',
 *       start: new Date('2023-10-01T10:00:00'),
 *       resource: { color: '#33FF57' },
 *     },
 *   ]}
 *   onClose={() => console.log('Popover closed')}
 * />
 */
export const ShowMorePopup = ({
  count,
  remainingEvents,
  onClose,
}: Readonly<ShowMorePopupProps>) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const date = remainingEvents?.[0]?.start || new Date();

  return (
    <Popover
      open={isOpen}
      onOpenChange={(newOpen) => {
        setIsOpen(newOpen);
        if (!newOpen) onClose?.();
      }}
    >
      <PopoverTrigger asChild>
        <span className="text-xs font-normal text-medium-emphasis hover:text-high-emphasis hover:underline">
          +{count} {t('MORE')}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <div className="flex items-center justify-between bg-surface px-3 py-1">
          <h2 className="text-sm font-bold text-medium-emphasis">{format(date, 'PPP')}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4 text-medium-emphasis" />
          </Button>
        </div>
        <div className="flex flex-col gap-[6px] py-2 px-3">
          {remainingEvents.map((event: CalendarEvent) => {
            const textColorClass = getTextColorClassFromBg(event.resource?.color);
            const bgColorClass = `${event.resource?.color}`;
            return (
              <div
                key={event.eventId}
                style={{
                  color: `${textColorClass}`,
                  backgroundColor: `${bgColorClass}`,
                }}
                className="flex items-center gap-1 py-[2px] px-1 rounded-[4px]"
              >
                <span className="text-xs font-semibold whitespace-nowrap">
                  {format(event.start, 'hh:mm')}
                </span>
                <span className="text-xs font-normal truncate max-w-full">{event.title}</span>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
