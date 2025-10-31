import { EventProps } from 'react-big-calendar';
import { format } from 'date-fns';
import { getTextColorClassFromBg } from '../../utils/date-utils';

/**
 * EventsContent Component
 *
 * A component that displays the content of an event in the calendar.
 * It shows the time and title of the event, with the text color and background
 * color determined by the event's resource (member) color.
 *
 * Features:
 * - Displays the time and title of the event.
 * - Uses the event's resource color to determine text and background colors.
 *
 * Props:
 * - `event`: `{EventProps}` – The event object to display.
 *
 * @param {EventProps} props - The props for configuring the events content.
 * @example
 * <EventsContent event={event} />
 */

export const EventsContent = ({ event }: Readonly<EventProps>) => {
  const time = event.start ? format(event.start, 'HH:mm') : '';
  const textColorClass = getTextColorClassFromBg(event?.resource?.color);
  const bgColorClass = `${event?.resource?.color}`;

  return (
    <div
      style={{
        color: `${textColorClass}`,
        backgroundColor: `${bgColorClass}`,
      }}
      className="flex items-center gap-1 py-[2px] px-1 rounded-[4px]"
    >
      <span className="text-xs font-semibold whitespace-nowrap">{time}</span>
      <span className="text-xs font-normal truncate max-w-full">{event.title}</span>
    </div>
  );
};
