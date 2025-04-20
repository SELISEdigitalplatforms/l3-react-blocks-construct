import { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { Button } from 'components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Dialog,
} from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group';
import { Label } from 'components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { Calendar } from 'components/ui/calendar';
import { CalendarEvent } from '../../../types/calendar-event.types';
import { CALENDER_PERIOD, WEEK_DAYS_RRULE } from '../../../constants/calendar.constants';
import { RRule } from 'rrule';

interface EditRecurrenceProps {
  event: CalendarEvent;
  onNext: () => void;
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

// Map our period names to RRule frequencies
const FREQUENCY_MAP: Record<string, string> = {
  Day: 'DAILY',
  Week: 'WEEKLY',
  Month: 'MONTHLY',
  Year: 'YEARLY',
};

/**
 * EditRecurrence Component
 *
 * A dialog-based component for configuring recurrence rules for calendar events.
 * It allows users to define how often an event repeats, on which days, and when the repetition ends.
 * The component uses the `rrule` library to generate recurring events based on user-defined rules.
 *
 * Features:
 * - Configures recurrence frequency (daily, weekly, monthly, yearly).
 * - Selects specific days of the week for weekly recurrences.
 * - Defines end conditions for the recurrence (never, on a specific date, or after a certain number of occurrences).
 * - Generates a list of recurring events based on the configured rules.
 *
 * Props:
 * - `event`: `{CalendarEvent}` – The original event object for which recurrence is being configured.
 * - `onNext`: `{Function}` – Callback triggered when the dialog is closed or canceled.
 * - `setEvents`: `{React.Dispatch<React.SetStateAction<CalendarEvent[]>>}` – Function to update the state with the generated recurring events.
 *
 * @param {EditRecurrenceProps} props - The props for configuring the recurrence editor.
 * @returns {JSX.Element} The rendered JSX element for the recurrence editor dialog.
 *
 * @example
 * <EditRecurrence
 *   event={{
 *     eventId: '1',
 *     title: 'Team Meeting',
 *     start: new Date('2023-10-01T09:00:00'),
 *     end: new Date('2023-10-01T10:00:00'),
 *     allDay: false,
 *     resource: { color: '#FF5733' },
 *   }}
 *   onNext={() => console.log('Dialog closed')}
 *   setEvents={(events) => console.log('Generated events:', events)}
 * />
 */

// Helper function to determine recurrence pattern from existing events
const analyzeRecurringPattern = (events: CalendarEvent[]) => {
  if (!events || events.length < 2) return null;

  // Sort events by start date
  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

  // Get the first two events to analyze the pattern
  const first = sortedEvents[0];
  const second = sortedEvents[1];

  // Calculate the difference in days
  const diffTime = Math.abs(second.start.getTime() - first.start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Analyze which days of the week are included
  const weekdays = sortedEvents.slice(0, Math.min(7, sortedEvents.length)).map((event) => {
    const day = event.start.getDay();
    // Convert from JS day (0=Sunday) to our format (MO, TU, etc.)
    const dayNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    return dayNames[day];
  });

  // Remove duplicates
  const uniqueDays = Array.from(new Set(weekdays));

  // Determine the period and interval
  let period = 'Week';
  let interval = 1;

  if (diffDays === 1) {
    period = 'Day';
    interval = 1;
  } else if (diffDays === 7) {
    period = 'Week';
    interval = 1;
  } else if (diffDays > 1 && diffDays < 7) {
    period = 'Day';
    interval = diffDays;
  } else if (diffDays > 7 && diffDays % 7 === 0) {
    period = 'Week';
    interval = diffDays / 7;
  } else if (diffDays >= 28 && diffDays <= 31) {
    period = 'Month';
    interval = 1;
  } else if (diffDays >= 365 && diffDays <= 366) {
    period = 'Year';
    interval = 1;
  }

  return {
    period,
    interval,
    selectedDays: uniqueDays,
    // Estimate occurrenceCount based on the number of events
    occurrenceCount: events.length,
    // Estimate end date based on the last event
    endDate: sortedEvents[sortedEvents.length - 1].start,
  };
};

export function EditRecurrence({ event, onNext, setEvents }: Readonly<EditRecurrenceProps>) {
  // Load any temp event data saved before navigating here
  const [initialRecurrenceEvent] = useState<CalendarEvent>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('tempEditEvent');
      if (saved) {
        const parsed = JSON.parse(saved) as CalendarEvent;
        return {
          ...parsed,
          start: new Date(parsed.start),
          end: new Date(parsed.end),
          events: parsed.events
            ? parsed.events.map((evt) => ({
                ...evt,
                start: new Date(evt.start),
                end: new Date(evt.end),
              }))
            : [],
          resource: { ...parsed.resource },
        } as CalendarEvent;
      }
    }
    return event;
  });

  // Default to next month for the end date
  const defaultEndDate = addMonths(new Date(), 1);

  const [onDate, setOnDate] = useState<Date | undefined>(defaultEndDate);
  const [interval, setInterval] = useState<number>(1);
  const [period, setPeriod] = useState<string>('Week');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [endType, setEndType] = useState<'never' | 'on' | 'after'>('never');
  const [occurrenceCount, setOccurrenceCount] = useState<number>(5);

  // Pre-fill form fields if editing an existing recurring event
  useEffect(() => {
    // Use initialRecurrenceEvent.events for pattern analysis
    if (initialRecurrenceEvent.events && initialRecurrenceEvent.events.length > 1) {
      const pattern = analyzeRecurringPattern(initialRecurrenceEvent.events);

      if (pattern) {
        // Update form fields with detected pattern
        setPeriod(pattern.period);
        setInterval(pattern.interval);
        setSelectedDays(pattern.selectedDays);
        setOccurrenceCount(pattern.occurrenceCount);

        // If we detected an end date, set the end type to 'on'
        if (pattern.endDate) {
          setEndType('on');
          setOnDate(pattern.endDate);
        }
      } else {
        // If we couldn't detect a pattern, pre-select the current day of week
        const currentDayOfWeek = initialRecurrenceEvent.start.getDay();
        const dayNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
        setSelectedDays([dayNames[currentDayOfWeek]]);
      }
    } else {
      // For new recurring events, pre-select the current day of week
      const currentDayOfWeek = initialRecurrenceEvent.start.getDay();
      const dayNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
      setSelectedDays([dayNames[currentDayOfWeek]]);
    }
  }, [initialRecurrenceEvent]);

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Accept baseEvent so it uses the updated data
  const generateRecurringEvents = (baseEvent: CalendarEvent = initialRecurrenceEvent) => {
    // Build the rule string based on user selections
    let ruleString = `FREQ=${FREQUENCY_MAP[period]};INTERVAL=${interval}`;

    // Add weekdays if selected
    if (selectedDays.length > 0) {
      ruleString += `;BYDAY=${selectedDays.join(',')}`;
    }

    // Add end conditions based on user selection
    if (endType === 'on' && onDate) {
      ruleString += `;UNTIL=${format(onDate, 'yyyyMMdd')}T${format(onDate, 'HHmmss')}Z`;
    } else if (endType === 'after') {
      ruleString += `;COUNT=${occurrenceCount}`;
    }

    const rule = RRule.fromString(ruleString);

    // Generate occurrences within the specified range
    const eventOccurrences = rule.between(
      baseEvent.start,
      endType === 'on' && onDate
        ? onDate
        : new Date(new Date(baseEvent.start).getTime() + 365 * 24 * 60 * 60 * 1000)
    );

    // Calculate the original event duration in milliseconds
    const eventDuration = baseEvent.end.getTime() - baseEvent.start.getTime();

    // Get the original event's hours, minutes, seconds, milliseconds
    const originalStartHours = baseEvent.start.getHours();
    const originalStartMinutes = baseEvent.start.getMinutes();
    const originalStartSeconds = baseEvent.start.getSeconds();
    const originalStartMs = baseEvent.start.getMilliseconds();

    return eventOccurrences.map((date) => {
      // Create a new start date with the same time as the original event
      const newStart = new Date(date);
      newStart.setHours(
        originalStartHours,
        originalStartMinutes,
        originalStartSeconds,
        originalStartMs
      );

      // Create end date by adding the original duration to the new start date
      const newEnd = new Date(newStart.getTime() + eventDuration);

      // Create a new event based on baseEvent template
      return {
        ...baseEvent,
        eventId: crypto.randomUUID(),
        start: newStart,
        end: newEnd,
        resource: {
          ...baseEvent.resource,
          color: baseEvent.resource?.color || 'hsl(var(--primary-500))',
          recurring: true,
        },
      };
    });
  };

  const handleSave = () => {
    // Generate events based on the saved temp event
    const recurringEvents = generateRecurringEvents(initialRecurrenceEvent);
    if (recurringEvents.length > 0) {
      const tempEvent = window.localStorage.getItem('tempEditEvent');
      if (tempEvent) {
        window.localStorage.setItem('tempRecurringEvents', JSON.stringify(recurringEvents));
        onNext();
      } else {
        setEvents(recurringEvents);
        onNext();
      }
    } else {
      console.error('No recurring events were generated');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onNext}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Recurrence</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col gap-[6px]">
            <p className="font-normal text-sm text-high-emphasis">Repeat every</p>
            <div className="flex items-center gap-3 w-[60%]">
              <Input
                type="number"
                className="w-[40%]"
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                min={1}
              />
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CALENDER_PERIOD.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-[6px]">
            <p className="font-normal text-sm text-high-emphasis">Repeat on</p>
            <div className="flex items-center w-full gap-2">
              {WEEK_DAYS_RRULE.map((day) => (
                <Button
                  key={day}
                  variant={selectedDays.includes(day) ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs font-normal flex-1"
                  onClick={() => handleDayToggle(day)}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-normal text-sm text-high-emphasis">Ends</p>
            <div className="flex items-center gap-3 w-full">
              <RadioGroup
                value={endType}
                onValueChange={(value: 'never' | 'on' | 'after') => setEndType(value)}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="never" id="status-never" />
                  <Label htmlFor="status-never" className="cursor-pointer">
                    Never
                  </Label>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <div className="flex items-center gap-2 w-[40%]">
                    <RadioGroupItem value="on" id="status-on" />
                    <Label htmlFor="status-on" className="cursor-pointer">
                      On
                    </Label>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="relative w-[60%]">
                        <Input
                          readOnly
                          disabled={endType === 'never'}
                          value={onDate ? format(onDate, 'dd.MM.yyyy') : ''}
                          className={`cursor-pointer ${endType === 'never' ? 'opacity-50' : ''}`}
                        />
                        <CalendarIcon className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${endType === 'never' ? 'text-muted-foreground' : 'text-medium-emphasis'}`} />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={onDate} onSelect={setOnDate} disabled={endType === 'never'} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <div className="flex items-center gap-2 w-[40%]">
                    <RadioGroupItem value="after" id="status-after" />
                    <Label htmlFor="status-after" className="cursor-pointer">
                      After
                    </Label>
                  </div>
                  <Input
                    type="number"
                    className={`w-[60%] ${endType === 'never' ? 'opacity-50' : ''}`}
                    value={occurrenceCount}
                    onChange={(e) => setOccurrenceCount(Number(e.target.value))}
                    min={1}
                    disabled={endType === 'never'}
                  />
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        <DialogFooter className="flex w-full !flex-row !items-center gap-4 !mt-6">
          <Button variant="outline" onClick={onNext}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
