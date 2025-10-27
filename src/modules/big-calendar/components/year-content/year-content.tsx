import {
  format,
  startOfYear,
  eachDayOfInterval,
  getDay,
  isToday,
  addDays,
  subDays,
} from 'date-fns';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui-kit/tooltip';
import { CalendarEvent } from '../../types/calendar-event.types';
import { WEEK_DAYS } from '../../constants/calendar.constants';

interface YearContentProps {
  date: Date;
  events: CalendarEvent[];
  onSelectEvent: (eventOrDate: CalendarEvent | Date) => void;
}

/**
 * YearContent Component
 *
 * A calendar view component that displays events and dates for an entire year, organized by months.
 * Each month shows its days, with indicators for events and tooltips for event details.
 * It supports navigation between years and provides a callback for selecting events or dates.
 *
 * Features:
 * - Displays all 12 months of the given year in a grid layout.
 * - Highlights the current day and indicates days with events.
 * - Shows tooltips with event details when hovering over event-filled days.
 * - Supports navigation to the previous or next year.
 *
 * Props:
 * - `date`: `{Date}` – The year being displayed (used to determine the start of the year).
 * - `events`: `{CalendarEvent[]}` – An array of events to display on the calendar.
 * - `onSelectEvent`: `{Function}` – Callback triggered when a date or event is selected. Receives either a `CalendarEvent` or a `Date`.
 *
 * @param {YearContentProps} props - The props for configuring the year content view.
 *
 * Static Methods:
 * - `title(date: Date): string` – Returns the formatted title for the year view (e.g., "January 2023").
 * - `navigate(date: Date, action: 'PREV' | 'NEXT'): Date` – Calculates the previous or next year based on the action.
 *
 * @example
 * <YearContent
 *   date={new Date('2023-01-01')}
 *   events={[
 *     {
 *       eventId: '1',
 *       title: 'Team Meeting',
 *       start: new Date('2023-01-15T09:00:00'),
 *       end: new Date('2023-01-15T10:00:00'),
 *       resource: { color: '#FF5733' },
 *     },
 *   ]}
 *   onSelectEvent={(eventOrDate) => console.log('Selected:', eventOrDate)}
 * />
 */
export const YearContent = ({ date, events, onSelectEvent }: Readonly<YearContentProps>) => {
  const yearStart = startOfYear(date);
  const eventDates = new Set(events.map((event) => format(event.start, 'yyyy-MM-dd')));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 overflow-y-auto max-h-[80vh]">
      {Array.from({ length: 12 }, (_, i) => new Date(yearStart.getFullYear(), i)).map((month) => (
        <div key={format(month, 'yyyy-MM')} className="flex flex-col gap-2 sm:gap-3 items-center">
          <h2 className="text-base font-bold text-medium-emphasis">{format(month, 'MMMM yyyy')}</h2>
          <div className="grid grid-cols-7 gap-1 w-full">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="flex items-center justify-center py-1">
                <span className="font-semibold text-[10px] sm:text-xs uppercase text-high-emphasis">
                  {day[0]}
                </span>
              </div>
            ))}
            {renderMonthDays(month, eventDates, events, onSelectEvent)}
          </div>
        </div>
      ))}
    </div>
  );
};

const renderMonthDays = (
  month: Date,
  eventDates: Set<string>,
  events: CalendarEvent[],
  onSelectEvent: (eventOrDate: CalendarEvent | Date) => void
) => {
  const getMonthDates = (month: Date) => {
    const startOfMonthDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonthDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const days = eachDayOfInterval({ start: startOfMonthDate, end: endOfMonthDate });

    const firstDayIndex = getDay(startOfMonthDate);
    const lastDayPrevMonth = new Date(month.getFullYear(), month.getMonth(), 0);
    const prevDays =
      firstDayIndex > 0
        ? eachDayOfInterval({
            start: subDays(lastDayPrevMonth, firstDayIndex - 1),
            end: lastDayPrevMonth,
          })
        : [];

    const totalDaysBeforeNext = firstDayIndex + days.length;
    const nextDaysCount = totalDaysBeforeNext % 7 === 0 ? 0 : 7 - (totalDaysBeforeNext % 7);
    const firstDayNextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    const nextDays =
      nextDaysCount > 0
        ? eachDayOfInterval({
            start: firstDayNextMonth,
            end: addDays(firstDayNextMonth, nextDaysCount - 1),
          })
        : [];

    return [...prevDays, ...days, ...nextDays];
  };

  return getMonthDates(month).map((day) => {
    const dateString = format(day, 'yyyy-MM-dd');
    const hasEvent = eventDates.has(dateString);
    const dayEvents = events.filter((event) => format(event.start, 'yyyy-MM-dd') === dateString);

    const handleClick = () => {
      if (dayEvents.length === 1) {
        onSelectEvent(dayEvents[0]);
      } else {
        onSelectEvent(day);
      }
    };

    const isCurrentDay = isToday(day);
    const isFromOtherMonth = day.getMonth() !== month.getMonth();

    const dayElement = (
      <button
        key={dateString}
        type="button"
        onClick={handleClick}
        className={`
          relative flex flex-col items-center justify-center w-full aspect-square
          ${isCurrentDay ? 'bg-primary text-white rounded-full hover:bg-primary-600' : 'hover:bg-primary-50 hover:rounded-full'}
          ${isFromOtherMonth ? 'opacity-50' : ''}
          border-none p-0
        `}
      >
        {hasEvent && (
          <div
            className={`absolute top-1 w-[6px] h-[6px] rounded-full ${
              isCurrentDay ? 'bg-white' : 'bg-primary-300'
            }`}
          />
        )}
        <span
          className={`text-xs sm:text-sm font-normal ${isCurrentDay ? 'text-white' : 'text-high-emphasis'}`}
        >
          {format(day, 'd')}
        </span>
      </button>
    );

    if (!hasEvent) return dayElement;

    return (
      <Tooltip key={day.toDateString()}>
        <TooltipTrigger asChild>{dayElement}</TooltipTrigger>
        <TooltipContent className="bg-surface p-2">
          {dayEvents.map((event) => (
            <div key={event.eventId} className="flex items-center gap-1">
              <span className="text-[10px] sm:text-xs font-semibold text-medium-emphasis">
                {format(event.start, 'HH:mm')}
              </span>
              <span className="text-[10px] sm:text-xs font-normal text-medium-emphasis">
                {event.title}
              </span>
            </div>
          ))}
        </TooltipContent>
      </Tooltip>
    );
  });
};

YearContent.title = (date: Date) => format(date, 'MMMM yyyy');

YearContent.navigate = (date: Date, action: 'PREV' | 'NEXT') => {
  const newDate = new Date(date);
  newDate.setFullYear(action === 'PREV' ? date.getFullYear() - 1 : date.getFullYear() + 1);
  return newDate;
};
