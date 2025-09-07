import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  Views,
  View,
  EventPropGetter,
  Event,
  Formats,
  DayPropGetter,
  SlotPropGetter,
  SlotInfo,
} from 'react-big-calendar';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { AgendaContent } from '../agenda-content/agenda-content';
import { CalendarToolbar } from '../calendar-toolbar/calendar-toolbar';
import { EventsContent } from '../events-content/events-content';
import { YearContent } from '../year-content/year-content';
import { calendarTimeFormat, useCustomLocalizer } from '../../utils/locales';
import { ShowMore } from '../show-more/show-more';
import { CalendarEvent } from '../../types/calendar-event.types';
import { getTextColorClassFromBg } from '../../utils/date-utils';
import { useCalendarSettings } from '../../contexts/calendar-settings.context';
import './big-calendar.css';

const DnDCalendar = withDragAndDrop(Calendar);

interface BigCalendarProps {
  eventList?: Event[];
  onSelectSlot?: (slotInfo: SlotInfo) => void;
  onSelectEvent?: (event: Event, e: React.SyntheticEvent<HTMLElement>) => void;
  onEventDrop?: (args: EventInteractionArgs<Event>) => void;
  onEventResize?: (args: EventInteractionArgs<Event>) => void;
}

const ShowMoreComponent = (count: number, remainingEvents: object[]) => (
  <ShowMore count={count} remainingEvents={remainingEvents as CalendarEvent[]} />
);

/**
 * BigCalendar Component
 *
 * A customizable calendar component built with `react-big-calendar`.
 * Supports multiple views including day, week, month, agenda, and custom year view.
 *
 * Features:
 * - Custom toolbars and event renderers
 * - Agenda and year views with custom components
 * - Dynamic date and view management
 * - Color-coded event styling
 * - Transparent day and slot backgrounds
 * - Localized format and culture settings
 * - Drag and drop support for event resizing and moving
 *
 * Props:
 * - `eventList`: Array of calendar events to render
 * - `onSelectSlot`: Function to handle slot selection
 * - `onSelectEvent`: Function to handle event selection
 * - `onEventDrop`: Function to handle event drop
 * - `onEventResize`: Function to handle event resize
 *
 * @param {BigCalendarProps} props - Calendar setup and handlers
 * @returns {JSX.Element} The rendered calendar component
 *
 * @example
 * <BigCalendar
 *   eventList={myEvents}
 *   onSelectSlot={handleSlot}
 *   onSelectEvent={handleEvent}
 *   onEventDrop={handleEventDrop}
 *   onEventResize={handleEventResize}
 * />
 */

export function BigCalendar({
  eventList,
  onSelectSlot,
  onSelectEvent,
  onEventDrop,
  onEventResize,
}: Readonly<BigCalendarProps>) {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>(Views.MONTH);
  const { settings } = useCalendarSettings();
  const calendarRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if ((view === Views.DAY || view === Views.WEEK) && calendarRef.current) {
      setTimeout(() => {
        const currentTimeIndicator = calendarRef.current?.querySelector(
          '.rbc-current-time-indicator'
        );
        if (currentTimeIndicator) {
          currentTimeIndicator.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [view]);

  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);
  const onView = useCallback((newView: View) => setView(newView), [setView]);

  const { events, components, formats } = useMemo(
    () => ({
      components: {
        toolbar: CalendarToolbar,
        event: EventsContent,
      },
      formats: {
        ...calendarTimeFormat,
        dayFormat: (date: Date) => format(date, 'EEE d'),
      },
      events: eventList ?? [],
    }),
    [eventList]
  );

  const customLocalizer = useCustomLocalizer(settings);

  const eventPropGetter = useCallback<EventPropGetter<Event>>((event) => {
    const defaultColor = 'hsl(var(--primary-500))';
    const eventColor = event?.resource?.color || defaultColor;
    const textColorClass = getTextColorClassFromBg(eventColor);

    const style = {
      border: 'none',
      backgroundColor: eventColor,
      color: textColorClass,
    };

    return {
      style,
      className: 'cursor-pointer filter hover:brightness-90 transition',
    };
  }, []);

  const dayPropGetter = useCallback<DayPropGetter>(() => {
    return {
      className: '!bg-transparent',
    };
  }, []);

  const slotPropGetter = useCallback<SlotPropGetter>(() => {
    return {
      className: '!bg-transparent',
    };
  }, []);

  const handleSelect = (eventOrDate: Event | Date, e: React.SyntheticEvent<HTMLElement>) => {
    if (eventOrDate instanceof Date) {
      onNavigate(eventOrDate);
      onView(Views.DAY);
    } else {
      onSelectEvent?.(eventOrDate, e);
    }
  };

  return (
    <div ref={calendarRef}>
      <DnDCalendar
        className="rounded-[8px] border-[1px] border-border bg-white"
        components={components}
        formats={formats as Formats}
        dayLayoutAlgorithm="overlap"
        date={date}
        events={events}
        dayPropGetter={dayPropGetter}
        eventPropGetter={eventPropGetter}
        localizer={customLocalizer}
        style={{ height: '79dvh', width: '100%' }}
        showMultiDayTimes
        slotPropGetter={slotPropGetter}
        timeslots={1}
        onNavigate={onNavigate}
        onView={onView}
        view={view}
        popup={false}
        onSelectEvent={handleSelect}
        doShowMoreDrillDown={false}
        selectable="ignoreEvents"
        onSelectSlot={onSelectSlot}
        culture={settings.firstDayOfWeek === 0 ? 'en-US' : 'en-GB'}
        step={settings.timeScale}
        defaultView={Views.WEEK}
        views={
          {
            week: true,
            month: true,
            day: true,
            agenda: AgendaContent,
            year: YearContent,
          } as any
        }
        messages={{
          noEventsInRange: t('NO_SCHEDULED_EVENTS_TIME_PERIOD'),
          showMore: ShowMoreComponent,
        }}
        resizable
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
      />
    </div>
  );
}
