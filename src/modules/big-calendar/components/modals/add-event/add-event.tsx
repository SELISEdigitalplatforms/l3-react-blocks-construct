import React, { useLayoutEffect, useRef, useState, useMemo, useEffect } from 'react';
import { generateUuid } from '@/utils/uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui-kit/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui-kit/form';
import { Input } from '@/components/ui-kit/input';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui-kit/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
  Close as PopoverClose,
} from '@/components/ui-kit/popover';
import { Separator } from '@/components/ui-kit/separator';
import { Switch } from '@/components/ui-kit/switch';
import { Calendar } from '@/components/ui-kit/calendar';
import { Label } from '@/components/ui-kit/label';
import { ColorPickerTool } from '../../color-picker-tool/color-picker-tool';
import { AddEventFormValues, formSchema } from '../../../utils/form-schema';
import { generateTimePickerRange } from '../../../utils/date-utils';
import { EventParticipant } from '../../event-participant/event-participant';
import { Member, CalendarEvent } from '../../../types/calendar-event.types';
import { members } from '../../../services/calendar-services';
import { EditRecurrence } from '../edit-recurrence/edit-recurrence';
import { useCalendarSettings } from '../../../contexts/calendar-settings.context';
import { WEEK_DAYS } from '../../../constants/calendar.constants';

type FinalAddEventFormValues = Omit<AddEventFormValues, 'members'> & {
  members: Member[];
  events?: CalendarEvent[];
};

interface AddEventProps {
  start: Date;
  end: Date;
  onSubmit: (data: FinalAddEventFormValues) => void;
  onCancel: () => void;
}

// Extracted DatePicker Component
interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label: string;
}

const DatePicker = ({ value, onChange, label }: DatePickerProps) => (
  <div className="flex flex-col gap-[6px]">
    <Label className="font-normal text-sm">{label}</Label>
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            readOnly
            value={value ? format(value, 'dd.MM.yyyy') : ''}
            className="cursor-pointer"
          />
          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-emphasis" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  </div>
);

// Extracted TimePicker Component
interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  width: number;
  timePickerRange: string[];
}

const TimePicker = ({
  value,
  onChange,
  label,
  isOpen,
  onOpenChange,
  containerRef,
  width,
  timePickerRange,
}: TimePickerProps) => (
  <div className="flex flex-col gap-[6px]">
    <Label className="font-normal text-sm">{label}</Label>
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (open && containerRef.current) {
          // Handle width setting logic in parent component
        }
      }}
    >
      <PopoverAnchor asChild>
        <div ref={containerRef} className="relative w-full">
          <Input
            type="time"
            step="60"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <PopoverTrigger asChild>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent
        sideOffset={4}
        align="start"
        className="max-h-60 overflow-auto p-1 bg-popover shadow-md rounded-md"
        style={width > 0 ? { width, boxSizing: 'border-box' } : undefined}
      >
        {timePickerRange.map((time) => (
          <PopoverClose asChild key={time}>
            <button
              type="button"
              onClick={() => onChange(time)}
              className="w-full text-left cursor-pointer px-3 py-1 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
            >
              {time}
            </button>
          </PopoverClose>
        ))}
      </PopoverContent>
    </Popover>
  </div>
);

// Extracted SwitchField Component
interface SwitchFieldProps {
  control: any;
  name: string;
  label: string;
}

const SwitchField = ({ control, name, label }: SwitchFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <div className="flex items-center gap-4">
        <Switch checked={field.value} onCheckedChange={field.onChange} />
        <Label>{label}</Label>
      </div>
    )}
  />
);

// Constants
const DEFAULT_COLOR = 'hsl(var(--primary-500))';
const TEMP_EVENT_KEY = 'tempEditEvent';
const TEMP_RECURRENCE_SETTINGS_KEY = 'tempRecurrenceSettings';
const TEMP_RECURRING_EVENTS_KEY = 'tempRecurringEvents';

// Helper functions
const parseTimeString = (timeStr: string): [number, number] => {
  return timeStr.split(':').map(Number) as [number, number];
};

const createFullDateTime = (date: Date, timeStr: string, isAllDay: boolean): Date => {
  const fullDate = new Date(date);
  if (!isAllDay) {
    const [hour, minute] = parseTimeString(timeStr);
    fullDate.setHours(hour, minute, 0, 0);
  } else {
    fullDate.setHours(0, 0, 0, 0);
  }
  return fullDate;
};

const createEndDateTime = (date: Date, timeStr: string, isAllDay: boolean): Date => {
  const fullDate = new Date(date);
  if (!isAllDay) {
    const [hour, minute] = parseTimeString(timeStr);
    fullDate.setHours(hour, minute, 0, 0);
  } else {
    fullDate.setHours(23, 59, 59, 999);
  }
  return fullDate;
};

const clearTempData = (): void => {
  const keys = [TEMP_RECURRENCE_SETTINGS_KEY, TEMP_RECURRING_EVENTS_KEY, TEMP_EVENT_KEY];
  keys.forEach((key) => window.localStorage.removeItem(key));
};

const setTempEventToStorage = (eventData: any): void => {
  try {
    window.localStorage.removeItem(TEMP_EVENT_KEY);
    window.localStorage.setItem(TEMP_EVENT_KEY, JSON.stringify(eventData));
  } catch (error) {
    console.error('Error saving temp event:', error);
    // Try to save minimal version on quota exceeded
    try {
      const minimalData = {
        eventId: eventData.eventId,
        start: eventData.start,
        end: eventData.end,
        allDay: eventData.allDay,
      };
      window.localStorage.setItem(TEMP_EVENT_KEY, JSON.stringify(minimalData));
    } catch (e) {
      console.error('Failed to save even minimal event:', e);
    }
  }
};

const createBaseEvent = (
  title: string,
  start: Date,
  end: Date,
  allDay: boolean,
  formData: AddEventFormValues,
  selectedColor: string | null,
  selectedMembers: Member[]
): CalendarEvent => ({
  eventId: generateUuid(),
  title,
  start,
  end,
  allDay,
  resource: {
    meetingLink: formData.meetingLink ?? '',
    description: formData.description ?? '',
    color: selectedColor ?? DEFAULT_COLOR,
    recurring: true,
    members: selectedMembers,
  },
});

/**
 * AddEvent Component
 *
 * A dialog-based form for creating or editing calendar events. It includes fields for event details
 * such as title, meeting link, participants, date/time, recurrence, and color selection.
 *
 * Features:
 * - Form validation using `react-hook-form` and `zod`.
 * - Date and time pickers for setting event start and end times.
 * - Participant selection using the `EventParticipant` component.
 * - Recurrence handling with a modal (`EditRecurrence`).
 * - Color picker for event customization.
 * - All-day and recurring event toggles.
 *
 * Props:
 * - `start`: `{Date}` – The initial start date and time for the event.
 * - `end`: `{Date}` – The initial end date and time for the event.
 * - `onSubmit`: `{Function}` – Callback triggered when the form is submitted. Receives the final event data.
 * - `onCancel`: `{Function}` – Callback triggered when the form is canceled.
 *
 * @param {AddEventProps} props - The props for configuring the event creation form.
 * @example
 * <AddEvent
 *   start={new Date()}
 *   end={new Date(new Date().getTime() + 3600 * 1000)}
 *   onSubmit={(data) => handleEventSubmit(data)}
 *   onCancel={() => handleCloseForm()}
 * />
 */
type EditorComponentType = React.ComponentType<any> | null;

export const AddEvent = ({ start, end, onCancel, onSubmit }: Readonly<AddEventProps>) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState<Date | undefined>(start);
  const [endDate, setEndDate] = useState<Date | undefined>(end);
  const [startTime, setStartTime] = useState(() => format(start, 'HH:mm'));
  const [endTime, setEndTime] = useState(() => format(end, 'HH:mm'));
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showRecurrenceModal, setShowRecurrenceModal] = useState(false);
  const [tempEvent, setTempEvent] = useState<CalendarEvent | null>(null);
  const [recurringEvents, setRecurringEvents] = useState<CalendarEvent[]>([]);
  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [startWidth, setStartWidth] = useState(0);
  const [endWidth, setEndWidth] = useState(0);
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);
  const [editorComponent, setEditorComponent] = useState<EditorComponentType>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { settings } = useCalendarSettings();
  const timePickerRange = useMemo(
    () => generateTimePickerRange(settings.defaultDuration),
    [settings.defaultDuration]
  );

  const recurrenceText = useMemo(() => {
    if (recurringEvents.length === 0) {
      return `${t('OCCURS_ON')} ${WEEK_DAYS[startDate?.getDay() ?? new Date().getDay()]}`;
    }

    const uniqueDays = Array.from(
      new Set(
        recurringEvents.map((e) => {
          const startDate = new Date(e.start);
          return WEEK_DAYS[startDate.getDay() ?? new Date().getDay()];
        })
      )
    );
    if (uniqueDays.length === 1) return `${t('OCCURS_ON')} ${uniqueDays[0]}`;
    const last = uniqueDays.splice(uniqueDays.length - 1, 1)[0];
    return `${t('OCCURS_ON')} ${uniqueDays.join(', ')} and ${last}`;
  }, [recurringEvents, startDate, t]);

  useLayoutEffect(() => {
    const update = () => {
      if (startRef.current) setStartWidth(startRef.current.offsetWidth);
      if (endRef.current) setEndWidth(endRef.current.offsetWidth);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    import('@/components/core/custom-text-editor/custom-text-editor')
      .then(({ CustomTextEditor }) => {
        setEditorComponent(() => CustomTextEditor as React.ComponentType<any>);
      })
      .catch((error) => {
        console.error('Error loading editor:', error);
      });
  }, []);

  const form = useForm<AddEventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      start: start.toISOString().slice(0, 16),
      end: end.toISOString().slice(0, 16),
      meetingLink: '',
      color: '',
      allDay: false,
      recurring: false,
      members: [],
      description: '',
    },
  });

  const handleFormSubmit = (data: AddEventFormValues) => {
    if (!startDate || !endDate) return;

    const memberIds: string[] = data.members ?? [];
    const fullStart = createFullDateTime(startDate, startTime, data.allDay ?? false);
    const fullEnd = createEndDateTime(endDate, endTime, data.allDay ?? false);

    if (fullEnd < fullStart) {
      toast({
        variant: 'destructive',
        title: t('WRONG_TIME_SELECTED'),
        description: t('PLEASE_SELECT_PROPER_END_TIME'),
      });
      return;
    }

    const selectedMembers: Member[] = memberIds
      .map((id) => members.find((member) => member.id === id))
      .filter((member): member is Member => Boolean(member));

    let events: CalendarEvent[] | undefined = undefined;

    if (data.recurring && recurringEvents.length > 0) {
      // Use the existing recurring events with updated form data
      events = recurringEvents.map(
        (event): CalendarEvent => ({
          ...event,
          title: data.title,
          resource: {
            ...event.resource,
            description: data.description,
            meetingLink: data.meetingLink,
            color: selectedColor ?? DEFAULT_COLOR,
          },
        })
      );
    } else if (data.recurring) {
      // Create default weekly recurring events if recurring is true but no events defined
      events = [];
      const baseEvent = createBaseEvent(
        data.title,
        fullStart,
        fullEnd,
        data.allDay ?? false,
        data,
        selectedColor,
        selectedMembers
      );

      // Add the original event
      events.push(baseEvent);

      // Add 3 more weekly occurrences
      for (let i = 1; i <= 3; i++) {
        const newStart = new Date(fullStart);
        newStart.setDate(newStart.getDate() + i * 7);

        const newEnd = new Date(fullEnd);
        newEnd.setDate(newEnd.getDate() + i * 7);

        events.push({
          ...baseEvent,
          eventId: generateUuid(),
          start: newStart,
          end: newEnd,
        });
      }
    }

    // Prepare the final payload for both recurring and non-recurring events
    const payload: FinalAddEventFormValues = {
      ...data,
      start: fullStart.toISOString(),
      end: fullEnd.toISOString(),
      meetingLink: data.meetingLink ?? '',
      color: selectedColor ?? DEFAULT_COLOR,
      allDay: data.allDay,
      recurring: data.recurring,
      description: data.description ?? '',
      members: selectedMembers,
      events: events,
    };

    onSubmit(payload);
  };

  const handleRecurrenceClick = () => {
    if (!startDate || !endDate) return;

    const fullStart = createFullDateTime(startDate, startTime, form.getValues('allDay') ?? false);
    const fullEnd = createEndDateTime(endDate, endTime, form.getValues('allDay') ?? false);

    const selectedMembers = (form
      .getValues('members')
      ?.map((id) => members.find((m) => m.id === id))
      .filter(Boolean) || []) as Member[];

    // Create a minimal temporary event for the recurrence modal
    const tempEventData = {
      eventId:
        crypto?.randomUUID?.() ||
        `event-${Date.now()}-${performance.now().toString().replace('.', '')}`,
      title: form.getValues('title') || 'New Event',
      start: fullStart.toISOString(),
      end: fullEnd.toISOString(),
      allDay: form.getValues('allDay'),
      resource: {
        meetingLink: form.getValues('meetingLink'),
        description: form.getValues('description'),
        color: selectedColor ?? DEFAULT_COLOR,
        recurring: true,
        members: form.getValues('members') || [],
      },
    };

    setTempEventToStorage(tempEventData);

    setTempEvent({
      ...tempEventData,
      start: fullStart,
      end: fullEnd,
      resource: {
        ...tempEventData.resource,
        members: selectedMembers,
      },
    });
    setShowRecurrenceModal(true);
  };

  const handleRecurrenceClose = () => {
    setShowRecurrenceModal(false);
    setTempEvent(null);

    const tempRecurringEvents = window.localStorage.getItem(TEMP_RECURRING_EVENTS_KEY);
    if (tempRecurringEvents) {
      try {
        const parsedEvents = JSON.parse(tempRecurringEvents);
        if (Array.isArray(parsedEvents) && parsedEvents.length > 0) {
          const memberIds = form.getValues('members') || [];
          const selectedMembers = memberIds
            .map((id) => members.find((m) => m.id === id))
            .filter((member): member is Member => member !== undefined);

          const updatedEvents: CalendarEvent[] = parsedEvents.map((event) => ({
            eventId: event.id || generateUuid(),
            title: event.title || form.getValues('title') || 'New Event',
            start: new Date(event.start),
            end: new Date(event.end),
            allDay: event.allDay || false,
            resource: {
              meetingLink: form.getValues('meetingLink'),
              description: form.getValues('description'),
              color: event.resource?.color || selectedColor || DEFAULT_COLOR,
              recurring: true,
              members: selectedMembers,
            },
          }));
          setRecurringEvents(updatedEvents);
          form.setValue('recurring', true);
        }
      } catch (error) {
        console.error('Error parsing recurring events:', error);
      }
    }
  };

  const handleCancel = () => {
    form.reset();
    setStartDate(start);
    setEndDate(end);
    setStartTime('');
    setEndTime('');
    setSelectedColor(null);
    setRecurringEvents([]);
    clearTempData();
    onCancel();
  };

  const handleStartTimeOpenChange = (open: boolean) => {
    setIsStartTimeOpen(open);
    if (open && startRef.current) {
      setStartWidth(startRef.current.offsetWidth);
    }
  };

  const handleEndTimeOpenChange = (open: boolean) => {
    setIsEndTimeOpen(open);
    if (open && endRef.current) {
      setEndWidth(endRef.current.offsetWidth);
    }
  };

  const isAllDay = form.watch('allDay');

  // Add cleanup effect
  useEffect(() => {
    return () => {
      clearTempData();
    };
  }, []);

  return (
    <>
      <DialogContent className="w-full sm:max-w-[720px] max-h-[96vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('ADD_EVENT')}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal text-sm">{t('TITLE')}*</FormLabel>
                  <FormControl>
                    <Input placeholder={t('ENTER_EVENT_TITLE')} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="meetingLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal text-sm">{t('MEETING_LINK')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('ENTER_YOUR_MEETING_LINK')} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal text-sm">{t('PARTICIPANTS')}</FormLabel>
                  <EventParticipant selected={field.value ?? []} onChange={field.onChange} />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row w-full gap-4">
              <div className="flex gap-4 w-full sm:w-[60%]">
                <div className="grid grid-cols-2 gap-4">
                  <DatePicker value={startDate} onChange={setStartDate} label={t('START_DATE')} />
                  {!isAllDay && (
                    <TimePicker
                      value={startTime}
                      onChange={setStartTime}
                      label={t('START_TIME')}
                      isOpen={isStartTimeOpen}
                      onOpenChange={handleStartTimeOpenChange}
                      containerRef={startRef}
                      width={startWidth}
                      timePickerRange={timePickerRange}
                    />
                  )}
                  <DatePicker value={endDate} onChange={setEndDate} label={t('END_DATE')} />
                  {!isAllDay && (
                    <TimePicker
                      value={endTime}
                      onChange={setEndTime}
                      label={t('END_TIME')}
                      isOpen={isEndTimeOpen}
                      onOpenChange={handleEndTimeOpenChange}
                      containerRef={endRef}
                      width={endWidth}
                      timePickerRange={timePickerRange}
                    />
                  )}
                </div>
              </div>
              <Separator orientation="vertical" className="hidden sm:flex" />
              <div className="flex flex-col w-full sm:w-[40%] gap-4">
                <SwitchField control={form.control} name="allDay" label={t('ALL_DAY')} />
                <SwitchField control={form.control} name="recurring" label={t('RECURRING_EVENT')} />
                {form.watch('recurring') && (
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handleRecurrenceClick}
                      className="underline text-primary text-base cursor-pointer font-semibold hover:text-primary-800 bg-transparent border-none p-0"
                    >
                      {recurrenceText}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-base text-high-emphasis">{t('DESCRIPTION')}</p>
                  <div className="flex flex-col flex-1">
                    {isMounted && editorComponent ? (
                      React.createElement(editorComponent, {
                        value: field.value,
                        onChange: field.onChange,
                        showIcons: false,
                      })
                    ) : (
                      <div className="border rounded-md p-4">{t('LOADING_EDITOR')}</div>
                    )}
                  </div>
                  {fieldState.error && (
                    <span className="text-xs text-destructive">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-base text-high-emphasis">{t('COLORS')}</p>
              <ColorPickerTool
                selectedColor={selectedColor}
                onColorChange={(color) => setSelectedColor(color)}
              />
            </div>
            <div className="flex justify-end w-full gap-4 !mt-6">
              <Button variant="outline" type="button" onClick={handleCancel}>
                {t('DISCARD')}
              </Button>
              <Button type="submit">{t('SAVE')}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
      {showRecurrenceModal && tempEvent && (
        <EditRecurrence
          event={tempEvent}
          onNext={handleRecurrenceClose}
          setEvents={(events) => {
            if (Array.isArray(events) && events.length > 0) {
              const processedEvents = events.map((event) => ({
                ...event,
                resource: {
                  ...event.resource,
                  description: form.getValues('description'),
                  color: selectedColor ?? event.resource?.color ?? DEFAULT_COLOR,
                },
              }));
              setRecurringEvents(processedEvents);
              form.setValue('recurring', true);
            }
          }}
        />
      )}
    </>
  );
};
