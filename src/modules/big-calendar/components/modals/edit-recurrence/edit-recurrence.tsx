import { useState, useEffect } from 'react';
import { generateUuid } from '@/utils/uuid';
import { CalendarIcon } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { RRule } from 'rrule';
import { Button } from '@/components/ui-kit/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Dialog,
} from '@/components/ui-kit/dialog';
import { Input } from '@/components/ui-kit/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-kit/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui-kit/radio-group';
import { Label } from '@/components/ui-kit/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui-kit/popover';
import { Calendar } from '@/components/ui-kit/calendar';
import { CalendarEvent } from '../../../types/calendar-event.types';
import { CALENDER_PERIOD, WEEK_DAYS_RRULE } from '../../../constants/calendar.constants';

interface EditRecurrenceProps {
  event: CalendarEvent;
  onNext: () => void;
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

type RecurrenceOption = 'never' | 'on' | 'after';

interface RecurrenceSettings {
  period?: RecurrenceOption;
  selectedDays?: string[];
  endType?: RecurrenceOption;
  interval?: number;
  onDate?: Date | null;
  occurrenceCount?: number;
}

// Map our period names to RRule frequencies
const FREQUENCY_MAP: Record<string, string> = {
  DAY: 'DAILY',
  WEEK: 'WEEKLY',
  MONTH: 'MONTHLY',
  YEAR: 'YEARLY',
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
  const weekdays = sortedEvents.map((event) => {
    const day = event.start.getDay();
    // Convert from JS day (0=Sunday) to our format (MO, TU, etc.)
    const dayNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    return dayNames[day];
  });

  // Remove duplicates
  const uniqueDays = Array.from(new Set(weekdays));

  // Determine the period and interval
  let period = 'WEEK';
  let interval = 1;

  if (diffDays === 1) {
    period = 'DAY';
  } else if (diffDays > 1 && diffDays < 7) {
    period = 'DAY';
    interval = diffDays;
  } else if (diffDays > 7 && diffDays % 7 === 0) {
    interval = diffDays / 7;
  } else if (diffDays >= 28 && diffDays <= 31) {
    period = 'MONTH';
  } else if (diffDays >= 365 && diffDays <= 366) {
    period = 'YEAR';
  }

  return {
    period,
    interval,
    selectedDays: uniqueDays,
    occurrenceCount: events.length,
    endDate: sortedEvents[sortedEvents.length - 1].start,
  };
};

export const EditRecurrence = ({ event, onNext, setEvents }: Readonly<EditRecurrenceProps>) => {
  const { t } = useTranslation();
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

  const defaultEndDate = addMonths(new Date(), 1);

  const [onDate, setOnDate] = useState<Date | undefined>(defaultEndDate);
  const [interval, setInterval] = useState<number>(1);
  const [period, setPeriod] = useState<string>(() => {
    // First check if we have recurrence pattern in the event resource
    if (initialRecurrenceEvent.resource?.recurrencePattern?.period) {
      return initialRecurrenceEvent.resource.recurrencePattern.period;
    }

    // Then check localStorage
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('tempRecurrenceSettings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.period || 'WEEK';
        } catch (error) {
          console.error('Error parsing tempRecurrenceSettings:', error);
        }
      }
    }
    return 'WEEK';
  });

  const [selectedDays, setSelectedDays] = useState<string[]>(() => {
    // First check if we have recurrence pattern in the event resource
    if (initialRecurrenceEvent.resource?.recurrencePattern?.selectedDays) {
      return initialRecurrenceEvent.resource.recurrencePattern.selectedDays;
    }

    // Then check if we have events to analyze
    if (initialRecurrenceEvent.events && initialRecurrenceEvent.events.length > 0) {
      const pattern = analyzeRecurringPattern(initialRecurrenceEvent.events);
      if (pattern) {
        return pattern.selectedDays;
      }
    }

    // Finally check localStorage
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('tempRecurrenceSettings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.selectedDays || [];
        } catch (error) {
          console.error('Error parsing tempRecurrenceSettings:', error);
        }
      }
    }

    // Default to current day if no other data available
    const currentDayOfWeek = initialRecurrenceEvent.start.getDay();
    const dayNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    return [dayNames[currentDayOfWeek]];
  });

  const [endType, setEndType] = useState<RecurrenceOption>(() => {
    // First check if we have recurrence pattern in the event resource
    if (initialRecurrenceEvent.resource?.recurrencePattern?.endType) {
      return initialRecurrenceEvent.resource.recurrencePattern.endType;
    }

    // Then check localStorage
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('tempRecurrenceSettings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.endType || 'never';
        } catch (error) {
          console.error('Error parsing tempRecurrenceSettings:', error);
        }
      }
    }
    return 'never';
  });

  const [occurrenceCount, setOccurrenceCount] = useState<number>(() => {
    // First check if we have recurrence pattern in the event resource
    if (initialRecurrenceEvent.resource?.recurrencePattern?.occurrenceCount) {
      return initialRecurrenceEvent.resource.recurrencePattern.occurrenceCount;
    }

    // Then check if we have events to analyze
    if (initialRecurrenceEvent.events && initialRecurrenceEvent.events.length > 0) {
      return initialRecurrenceEvent.events.length;
    }

    return 5; // Default value
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      period,
      selectedDays,
      endType,
      interval,
      onDate,
      occurrenceCount,
    };
    try {
      window.localStorage.setItem('tempRecurrenceSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving recurrence settings:', error);
    }
  }, [period, selectedDays, endType, interval, onDate, occurrenceCount]);

  const loadSavedSettings = (saved: string): RecurrenceSettings | null => {
    try {
      const parsed = JSON.parse(saved);
      return {
        period: parsed.period as RecurrenceOption,
        selectedDays: parsed.selectedDays,
        endType: parsed.endType as RecurrenceOption,
        interval: parsed.interval,
        onDate: parsed.onDate ? new Date(parsed.onDate) : null,
        occurrenceCount: parsed.occurrenceCount,
      };
    } catch (error) {
      console.error('Error loading recurrence settings:', error);
      return null;
    }
  };

  const applySettings = (settings: RecurrenceSettings | null) => {
    if (!settings) return;

    const { period, selectedDays, endType, interval, onDate, occurrenceCount } = settings;

    if (period) setPeriod(period);
    if (selectedDays) setSelectedDays(selectedDays);
    if (endType) setEndType(endType);
    if (interval) setInterval(interval);
    if (onDate) setOnDate(onDate);
    if (occurrenceCount) setOccurrenceCount(occurrenceCount);
  };

  // Load initial settings from localStorage if available
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = window.localStorage.getItem('tempRecurrenceSettings');
    if (!saved) return;

    const settings = loadSavedSettings(saved);
    applySettings(settings);
  }, []);

  // Pre-fill form fields if editing an existing recurring event
  useEffect(() => {
    const saved =
      typeof window !== 'undefined' && window.localStorage.getItem('tempRecurringEvents');
    if (!saved && (!initialRecurrenceEvent.events || initialRecurrenceEvent.events.length < 2)) {
      const currentDayOfWeek = initialRecurrenceEvent.start.getDay();
      const dayNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
      setSelectedDays([dayNames[currentDayOfWeek]]);
    } else if (!saved) {
      const pattern = analyzeRecurringPattern(initialRecurrenceEvent.events || []);
      if (pattern) {
        setPeriod(pattern.period);
        setInterval(pattern.interval);
        setSelectedDays(pattern.selectedDays);
        setOccurrenceCount(pattern.occurrenceCount);
        if (pattern.endDate) {
          setEndType('on');
          setOnDate(pattern.endDate);
        }
      }
    }
  }, [initialRecurrenceEvent]);

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Accept baseEvent so it uses the updated data
  const generateRecurringEvents = (baseEvent: CalendarEvent = initialRecurrenceEvent) => {
    let ruleString = `FREQ=${FREQUENCY_MAP[period]};INTERVAL=${interval}`;

    // Add weekdays if selected
    if (selectedDays.length > 0) {
      ruleString += `;BYDAY=${selectedDays.join(',')}`;
    }

    // Set the end date for recurrence
    let endDateTime: Date;
    if (endType === 'on' && onDate) {
      endDateTime = onDate;
      ruleString += `;UNTIL=${format(onDate, 'yyyyMMdd')}T${format(onDate, 'HHmmss')}Z`;
    } else if (endType === 'after') {
      ruleString += `;COUNT=${occurrenceCount}`;
      // For COUNT, set a far future date to ensure we get all occurrences
      endDateTime = new Date(baseEvent.start.getTime() + 10 * 365 * 24 * 60 * 60 * 1000); // 10 years
    } else {
      // If no end date or count is specified, generate events for 2 years by default
      endDateTime = new Date(baseEvent.start.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
      ruleString += `;UNTIL=${format(endDateTime, 'yyyyMMdd')}T${format(endDateTime, 'HHmmss')}Z`;
    }

    const rule = RRule.fromString(ruleString);

    // Get all occurrences between start and end date
    const eventOccurrences = rule.between(baseEvent.start, endDateTime);

    // If using COUNT, limit to the specified number of occurrences
    const limitedOccurrences =
      endType === 'after' ? eventOccurrences.slice(0, occurrenceCount) : eventOccurrences;

    const eventDuration = baseEvent.end.getTime() - baseEvent.start.getTime();
    const originalStartHours = baseEvent.start.getHours();
    const originalStartMinutes = baseEvent.start.getMinutes();
    const originalStartSeconds = baseEvent.start.getSeconds();
    const originalStartMs = baseEvent.start.getMilliseconds();

    return limitedOccurrences.map((date) => {
      const newStart = new Date(date);
      newStart.setHours(
        originalStartHours,
        originalStartMinutes,
        originalStartSeconds,
        originalStartMs
      );

      const newEnd = new Date(newStart.getTime() + eventDuration);

      return {
        ...baseEvent,
        eventId: generateUuid(),
        start: newStart,
        end: newEnd,
        resource: {
          ...baseEvent.resource,
          color: baseEvent.resource?.color ?? 'hsl(var(--primary-500))',
          recurring: true,
          selectedDays,
          period,
          interval,
          endType,
          onDate: onDate?.toISOString(),
          occurrenceCount,
          members: baseEvent.resource?.members ?? [],
          meetingLink: baseEvent.resource?.meetingLink ?? '',
          description: baseEvent.resource?.description ?? '',
        },
      };
    });
  };

  const handleSave = () => {
    const recurringEvents = generateRecurringEvents(initialRecurrenceEvent);

    if (recurringEvents.length === 0) {
      console.error('No recurring events were generated');
      return;
    }

    try {
      // Store the complete event template with all necessary data
      const eventTemplate: CalendarEvent = {
        ...initialRecurrenceEvent,
        start: new Date(initialRecurrenceEvent.start),
        end: new Date(initialRecurrenceEvent.end),
        resource: {
          ...initialRecurrenceEvent.resource,
          recurring: true,
          members: initialRecurrenceEvent.resource?.members ?? [],
          meetingLink: initialRecurrenceEvent.resource?.meetingLink ?? '',
          description: initialRecurrenceEvent.resource?.description ?? '',
          color: initialRecurrenceEvent.resource?.color ?? 'hsl(var(--primary-500))',
          patternChanged: true,
          recurrencePattern: {
            selectedDays,
            period,
            interval,
            endType,
            onDate: onDate?.toISOString(),
            occurrenceCount,
          },
        },
      };

      // Clear existing data before saving
      window.localStorage.removeItem('tempEditEvent');
      window.localStorage.setItem('tempEditEvent', JSON.stringify(eventTemplate));

      // Store all recurring events with complete data and convert dates to ISO strings
      const allEvents = recurringEvents.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        resource: {
          ...event.resource,
          recurring: true,
          members: event.resource?.members || [],
          meetingLink: event.resource?.meetingLink || '',
          description: event.resource?.description || '',
          color: event.resource?.color || 'hsl(var(--primary-500))',
          patternChanged: true,
          recurrencePattern: {
            selectedDays,
            period,
            interval,
            endType,
            onDate: onDate?.toISOString(),
            occurrenceCount,
          },
        },
      }));

      // Save all events to localStorage
      window.localStorage.setItem('tempRecurringEvents', JSON.stringify(allEvents));

      // Update the events state with parsed dates
      setEvents(allEvents);
      onNext();
    } catch (error) {
      console.error('Error saving recurring events:', error);

      try {
        // If storage fails, try with minimal data
        const minimalTemplate = {
          ...initialRecurrenceEvent,
          start: initialRecurrenceEvent.start.toISOString(),
          end: initialRecurrenceEvent.end.toISOString(),
          resource: {
            ...initialRecurrenceEvent.resource,
            recurring: true,
            selectedDays,
            period,
            interval,
            members: initialRecurrenceEvent.resource?.members || [],
          },
        };

        window.localStorage.setItem('tempEditEvent', JSON.stringify(minimalTemplate));

        // Store only essential event data
        const firstEvent = recurringEvents[0];
        if (firstEvent) {
          const minimalEvents = [
            {
              ...firstEvent,
              start: firstEvent.start.toISOString(),
              end: firstEvent.end.toISOString(),
              resource: {
                ...firstEvent.resource,
                recurring: true,
                selectedDays,
                period,
                interval,
                members: initialRecurrenceEvent.resource?.members || [],
              },
            },
          ];
          window.localStorage.setItem('tempRecurringEvents', JSON.stringify(minimalEvents));
        }

        setEvents(recurringEvents);
        onNext();
      } catch (e) {
        console.error('Failed to save even minimal data:', e);
        // If all else fails, just update the state and proceed
        setEvents(recurringEvents);
        onNext();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (!window.localStorage.getItem('tempRecurringEvents')) {
        window.localStorage.removeItem('tempRecurringEvents');
        window.localStorage.removeItem('tempEditEvent');
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      window.localStorage.removeItem('tempRecurringEvents');
      window.localStorage.removeItem('tempEditEvent');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Dialog open={true} onOpenChange={onNext}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('EDIT_RECURRENCE')}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col gap-[6px]">
            <p className="font-normal text-sm text-high-emphasis">{t('REPEAT_EVERY')}</p>
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
                      {t(period)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-[6px]">
            <p className="font-normal text-sm text-high-emphasis">{t('REPEAT_ON')}</p>
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
            <p className="font-normal text-sm text-high-emphasis">{t('ENDS')}</p>
            <div className="flex items-center gap-3 w-full">
              <RadioGroup
                value={endType}
                onValueChange={(value: RecurrenceOption) => setEndType(value)}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="never" id="status-never" />
                  <Label htmlFor="status-never" className="cursor-pointer">
                    {t('NEVER')}
                  </Label>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <div className="flex items-center gap-2 w-[40%]">
                    <RadioGroupItem value="on" id="status-on" />
                    <Label htmlFor="status-on" className="cursor-pointer">
                      {t('RECURRING_ON')}
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
                        <CalendarIcon
                          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${endType === 'never' ? 'text-muted-foreground' : 'text-medium-emphasis'}`}
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={onDate}
                        onSelect={setOnDate}
                        disabled={endType === 'never'}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <div className="flex items-center gap-2 w-[40%]">
                    <RadioGroupItem value="after" id="status-after" />
                    <Label htmlFor="status-after" className="cursor-pointer">
                      {t('AFTER')}
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
        <DialogFooter className="flex w-full !flex-row !items-center !justify-end gap-4 !mt-6">
          <Button variant="outline" onClick={onNext}>
            {t('CANCEL')}
          </Button>
          <Button onClick={handleSave}>{t('SAVE')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
