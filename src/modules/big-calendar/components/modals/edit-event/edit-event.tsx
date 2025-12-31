import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { endOfDay, format, startOfDay } from 'date-fns';
import { CalendarClock, CalendarIcon, Trash, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui-kit/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui-kit/form';
import { Input } from '@/components/ui-kit/input';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
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
import { ConfirmationModal } from '@/components/core';
import { useToast } from '@/hooks/use-toast';
import { AddEventFormValues, formSchema } from '../../../utils/form-schema';
import { ColorPickerTool } from '../../color-picker-tool/color-picker-tool';
import {
  CalendarEvent,
  DeleteUpdateEventOption,
  Member,
} from '../../../types/calendar-event.types';
import { EventParticipant } from '../../event-participant/event-participant';
import { members } from '../../../services/calendar-services';
import { DeleteRecurringEvent } from '../delete-recurring-event/delete-recurring-event';
import { generateTimePickerRange } from '../../../utils/date-utils';
import { useCalendarSettings } from '../../../contexts/calendar-settings.context';
import { WEEK_DAYS } from '../../../constants/calendar.constants';
import { UpdateRecurringEvent } from '../update-recurring-event/update-recurring-event';

interface EditEventProps {
  event: CalendarEvent;
  onClose: () => void;
  onNext: () => void;
  onUpdate: (event: CalendarEvent, updateOption?: DeleteUpdateEventOption) => void;
  onDelete: (eventId: string, deleteOption?: DeleteUpdateEventOption) => void;
  onRestore?: () => boolean;
}

const useEventDataInitialization = (event: CalendarEvent) => {
  return useState<CalendarEvent>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('tempEditEvent');
      if (saved) {
        return parseStoredEvent(saved);
      }
    }
    return event;
  });
};

const useRecurringEventsManagement = (initialEventData: CalendarEvent) => {
  const [recurringEvents, setRecurringEvents] = useState<CalendarEvent[]>(
    initialEventData.events || []
  );

  useEffect(() => {
    if (initialEventData.resource?.recurring) {
      const events = loadRecurringEventsFromStorage(initialEventData);
      if (events.length > 0) {
        setRecurringEvents(events);
      }
    }
  }, [initialEventData.resource?.recurring, initialEventData.events, initialEventData]);

  return [recurringEvents, setRecurringEvents] as const;
};

const parseStoredEvent = (storedData: string): CalendarEvent => {
  const parsed = JSON.parse(storedData) as CalendarEvent;
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
    resource: {
      ...parsed.resource,
      description: parsed.resource?.description ?? '',
    },
  };
};

const parseEventDates = (event: CalendarEvent) => ({
  start: new Date(event.start),
  end: new Date(event.end),
});

const parseRecurringEvents = (events: CalendarEvent[], originalMembers: any[] = []) => {
  return events.map((evt) => ({
    ...evt,
    start: new Date(evt.start),
    end: new Date(evt.end),
    resource: {
      ...evt.resource,
      members: originalMembers,
    },
  }));
};

const loadRecurringEventsFromStorage = (initialEventData: CalendarEvent): CalendarEvent[] => {
  let events: CalendarEvent[] = [];
  const originalMembers = initialEventData.resource?.members ?? [];

  // Try to load from tempEditEvent
  const tempEdit = window.localStorage.getItem('tempEditEvent');
  if (tempEdit) {
    try {
      const parsedEdit = JSON.parse(tempEdit) as CalendarEvent;
      events = parseRecurringEvents(parsedEdit.events ?? [], originalMembers);
    } catch (error) {
      console.error('Error parsing tempEditEvent', error);
    }
  }

  // If not enough events, try tempRecurringEvents
  if (events.length < 2) {
    const tempRec = window.localStorage.getItem('tempRecurringEvents');
    if (tempRec) {
      try {
        const parsedRec = JSON.parse(tempRec) as CalendarEvent[];
        events = parseRecurringEvents(parsedRec, originalMembers);
      } catch (error) {
        console.error('Error parsing tempRecurringEvents', error);
      }
    }
  }

  return events;
};

const getSelectedMembers = (memberIds: string[], initialEventData: CalendarEvent): Member[] => {
  return memberIds
    .map((id) =>
      [...members, ...(initialEventData.resource?.members ?? [])]?.find(
        (member) => member?.id === id
      )
    )
    .filter((member): member is Member => Boolean(member));
};

const createUpdatedEvent = (
  initialEventData: CalendarEvent,
  data: AddEventFormValues,
  startDateTime: Date,
  endDateTime: Date,
  selectedMembers: Member[],
  recurringEvents: CalendarEvent[],
  editorContent: string
): CalendarEvent => {
  const baseResource = {
    meetingLink: data.meetingLink ?? '',
    color: data.color ?? initialEventData.resource?.color ?? 'hsl(var(--primary-500))',
    description: editorContent,
    members: selectedMembers,
    patternChanged: true,
  };

  return {
    ...initialEventData,
    title: data.title,
    start: startDateTime,
    end: endDateTime,
    allDay: data.allDay,
    events:
      recurringEvents.length > 0
        ? recurringEvents.map((evt) => ({
            ...evt,
            title: data.title,
            resource: {
              ...evt.resource,
              ...baseResource,
              recurring: true,
            },
          }))
        : undefined,
    resource: {
      ...baseResource,
      recurring: initialEventData.resource?.recurring ?? false,
    },
  };
};

const clearLocalStorage = () => {
  window.localStorage.removeItem('tempEditEvent');
  window.localStorage.removeItem('tempRecurringEvents');
};

interface DateTimePickerProps {
  date: Date;
  time: string;
  isAllDay: boolean;
  isTimeOpen: boolean;
  timePickerRange: string[];
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  onTimeOpenChange: (open: boolean) => void;
  label: string;
  timeLabel: string;
  width: number;
  elementRef: React.RefObject<HTMLDivElement | null>;
}

function DateTimePicker({
  date,
  time,
  isAllDay,
  isTimeOpen,
  timePickerRange,
  onDateChange,
  onTimeChange,
  onTimeOpenChange,
  label,
  timeLabel,
  width,
  elementRef,
}: Readonly<DateTimePickerProps>) {
  return (
    <>
      <div className="flex flex-col gap-[6px]">
        <Label className="font-normal text-sm">{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                readOnly
                value={date ? format(date, 'dd.MM.yyyy') : ''}
                className="cursor-pointer"
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-emphasis" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(day) => onDateChange(day || new Date())}
            />
          </PopoverContent>
        </Popover>
      </div>
      {!isAllDay && (
        <div className="flex flex-col gap-[6px]">
          <Label className="font-normal text-sm">{timeLabel}</Label>
          <Popover
            modal={true}
            open={isTimeOpen}
            onOpenChange={(open) => {
              onTimeOpenChange(open);
              if (open && elementRef.current) {
                // Width update logic handled by parent
              }
            }}
          >
            <PopoverAnchor asChild>
              <div ref={elementRef} className="relative w-full">
                <Input
                  type="time"
                  step="60"
                  value={time}
                  onChange={(e) => onTimeChange(e.target.value)}
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
              {timePickerRange.map((timeOption) => (
                <PopoverClose asChild key={timeOption}>
                  <button
                    type="button"
                    onClick={() => onTimeChange(timeOption)}
                    className="w-full text-left cursor-pointer px-3 py-1 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                  >
                    {timeOption}
                  </button>
                </PopoverClose>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
}

/**
 * EditEvent Component
 *
 * A comprehensive form modal for editing a calendar event.
 * It uses `react-hook-form` with Zod schema validation, and allows users to update event metadata,
 * including title, time range, recurrence, participants, colors, and description.
 *
 * Features:
 * - Date and time pickers for start and end
 * - All-day and recurring event toggles
 * - Meeting link input
 * - Rich text editor for description
 * - Member selection
 * - Color tagging
 * - Delete confirmation modal
 * - Controlled modal with save and discard options
 *
 * Props:
 * @param {CalendarEvent} event - The calendar event to edit
 * @param {() => void} onClose - Callback for closing the dialog
 * @param {() => void} onNext - Callback triggered for recurrence configuration
 * @param {(event: CalendarEvent) => void} onUpdate - Callback to update the event with new data
 * @param {(eventId: string, deleteOption?: DeleteOption) => void} onDelete - Callback to delete the event by ID
 *
 */
type EditorComponentType = React.ComponentType<any> | null;

export const EditEvent = ({
  event,
  onClose,
  onNext,
  onUpdate,
  onDelete,
  onRestore,
}: Readonly<EditEventProps>) => {
  const { toast, dismiss } = useToast();
  const { t } = useTranslation();

  const [initialEventData] = useEventDataInitialization(event);
  const [recurringEvents, setRecurringEvents] = useRecurringEventsManagement(initialEventData);

  const parsedStart = useMemo(
    () =>
      initialEventData.start instanceof Date
        ? initialEventData.start
        : new Date(initialEventData.start as string),
    [initialEventData.start]
  );
  const parsedEnd = useMemo(
    () =>
      initialEventData.end instanceof Date
        ? initialEventData.end
        : new Date(initialEventData.end as string),
    [initialEventData.end]
  );

  const [startDate, setStartDate] = useState<Date>(parsedStart);
  const [endDate, setEndDate] = useState<Date>(parsedEnd);
  const [startTime, setStartTime] = useState(() => format(parsedStart, 'HH:mm'));
  const [endTime, setEndTime] = useState(() => format(parsedEnd, 'HH:mm'));
  const [editorContent, setEditorContent] = useState(initialEventData.resource?.description ?? '');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRecurringDeleteDialog, setShowRecurringDeleteDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [editorComponent, setEditorComponent] = useState<EditorComponentType>(null);
  const [isMounted, setIsMounted] = useState(false);

  const form = useForm<AddEventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialEventData.title,
      meetingLink: initialEventData.resource?.meetingLink,
      start: parsedStart.toISOString().slice(0, 16),
      end: parsedEnd.toISOString().slice(0, 16),
      allDay: initialEventData.allDay ?? false,
      color: initialEventData.resource?.color ?? '',
      description: initialEventData.resource?.description ?? '',
      recurring: initialEventData.resource?.recurring ?? false,
      members: initialEventData.resource?.members
        ? initialEventData.resource.members.map((m) => m.id)
        : [],
    },
  });

  useEffect(() => {
    setEditorContent(initialEventData.resource?.description ?? '');
  }, [initialEventData.resource?.description]);

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

  const isAllDay = form.watch('allDay');

  const recurrenceText = useMemo(() => {
    if (!form.watch('recurring')) return '';

    const evts = recurringEvents.length > 0 ? recurringEvents : initialEventData.events || [];
    const targetDate = evts.length > 0 ? new Date(evts[0].start) : startDate;
    const dayIndex = targetDate.getDay();
    const dayName = WEEK_DAYS[dayIndex] || 'Sunday';
    return dayName ? `${t('OCCURS_ON')} ${dayName}` : t('SET_RECURRENCE') || 'Set Recurrence';
  }, [form, recurringEvents, initialEventData.events, startDate, t]);

  const handleClose = () => {
    clearLocalStorage();
    onClose();
  };

  const resetFormWithEventData = (event: CalendarEvent, currentMembers: string[]) => {
    const { start, end } = parseEventDates(event);
    form.reset({
      title: event.title,
      meetingLink: event.resource?.meetingLink ?? '',
      start: start.toISOString().slice(0, 16),
      end: end.toISOString().slice(0, 16),
      allDay: event.allDay ?? false,
      color: event.resource?.color ?? '',
      description: event.resource?.description ?? '',
      recurring: event.resource?.recurring ?? false,
      members: currentMembers,
    });

    setStartDate(start);
    setEndDate(end);
    setStartTime(format(start, 'HH:mm'));
    setEndTime(format(end, 'HH:mm'));
    setEditorContent(event.resource?.description ?? '');
  };

  useEffect(() => {
    const savedEventData = window.localStorage.getItem('tempEditEvent');
    const currentMembers =
      form.getValues('members') || initialEventData.resource?.members?.map((m) => m.id) || [];

    if (savedEventData) {
      const parsed = JSON.parse(savedEventData) as CalendarEvent;
      resetFormWithEventData(parsed, currentMembers);
      const events = loadRecurringEventsFromStorage(initialEventData);
      setRecurringEvents(events);
    } else {
      resetFormWithEventData(initialEventData, currentMembers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEventData, form, parsedStart, parsedEnd]);

  const onSubmit = (data: AddEventFormValues, updateOption?: DeleteUpdateEventOption) => {
    try {
      const memberIds: string[] = data.members ?? [];

      const startDateTime = data.allDay
        ? startOfDay(startDate)
        : new Date(`${format(startDate, 'yyyy-MM-dd')}T${startTime}`);
      const endDateTime = data.allDay
        ? endOfDay(endDate)
        : new Date(`${format(endDate, 'yyyy-MM-dd')}T${endTime}`);

      if (!startDateTime || !endDateTime) {
        toast({
          variant: 'destructive',
          title: t('INVALID_DATE_TIME'),
          description: t('PLEASE_SELECT_VALID_DATE_TIMES'),
        });
        return;
      }

      const selectedMembers = getSelectedMembers(memberIds, initialEventData);
      const updatedEvent = createUpdatedEvent(
        initialEventData,
        data,
        startDateTime,
        endDateTime,
        selectedMembers,
        recurringEvents,
        editorContent
      );

      onUpdate(updatedEvent, updateOption);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: 'destructive',
        title: t('EVENT_NOT_SAVED'),
        description: t('COULDNT_SAVE_YOUR_EVENT'),
      });
    }
  };

  const handleDeleteClick = () => {
    if (initialEventData.resource?.recurring) {
      setShowRecurringDeleteDialog(true);
    } else {
      setShowDeleteDialog(true);
    }
  };

  // Handle undo delete action
  const handleUndoDelete = () => {
    if (onRestore) {
      onRestore();
      dismiss();
    }
  };

  const handleDeleteConfirm = () => {
    onDelete(initialEventData.eventId ?? '', 'this');
    onClose();
    setShowDeleteDialog(false);
    toast({
      variant: 'success',
      title: t('EVENT_DELETED'),
      description: t('EVENT_SUCCESSFULLY_REMOVE_CALENDAR'),
      action: onRestore ? (
        <Button variant="link" size="sm" onClick={handleUndoDelete}>
          {t('UNDO')}
        </Button>
      ) : undefined,
    });
  };

  const handleRecurringDeleteConfirm = (deleteOption: DeleteUpdateEventOption) => {
    onDelete(initialEventData.eventId ?? '', deleteOption);
    onClose();
    setShowRecurringDeleteDialog(false);
    toast({
      variant: 'success',
      title: t('EVENT_DELETED'),
      description: t('EVENT_SUCCESSFULLY_REMOVE_CALENDAR'),
      action: onRestore ? (
        <Button variant="link" size="sm" onClick={handleUndoDelete}>
          {t('UNDO')}
        </Button>
      ) : undefined,
    });
  };

  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [startWidth, setStartWidth] = useState(0);
  const [endWidth, setEndWidth] = useState(0);
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);

  const { settings } = useCalendarSettings();
  const timePickerRange = useMemo(
    () => generateTimePickerRange(settings.defaultDuration),
    [settings.defaultDuration]
  );

  useLayoutEffect(() => {
    const update = () => {
      if (startRef.current) setStartWidth(startRef.current.offsetWidth);
      if (endRef.current) setEndWidth(endRef.current.offsetWidth);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleFormSubmit = (data: AddEventFormValues) => {
    if (initialEventData.resource?.recurring) {
      setShowUpdateDialog(true);
      // Store the form data temporarily
      window.localStorage.setItem('tempUpdateData', JSON.stringify(data));
    } else {
      onSubmit(data);
    }
  };

  const handleUpdateConfirm = (updateOption: DeleteUpdateEventOption) => {
    const tempData = window.localStorage.getItem('tempUpdateData');
    if (tempData) {
      const formData = JSON.parse(tempData) as AddEventFormValues;
      onSubmit(formData, updateOption);
      window.localStorage.removeItem('tempUpdateData');
    }
    setShowUpdateDialog(false);
  };

  const handleRecurringToggle = (checked: boolean) => {
    form.setValue('recurring', checked);
    if (checked && !recurringEvents.length) {
      setRecurringEvents([
        {
          ...initialEventData,
          start: startDate,
          end: endDate,
          resource: {
            ...initialEventData.resource,
            recurring: true,
          },
        },
      ]);
    }
  };

  const handleRecurringClick = () => {
    // Ensure recurring flag is enabled before proceeding
    if (!form.getValues('recurring')) {
      handleRecurringToggle(true);
    }
    const memberIds = form.getValues('members') ?? [];
    const selectedMembers = getSelectedMembers(memberIds, initialEventData);

    const tempEventData: CalendarEvent = {
      events: recurringEvents,
      ...initialEventData,
      title: form.getValues('title') || initialEventData.title,
      start: new Date(`${format(startDate, 'yyyy-MM-dd')}T${startTime}`),
      end: new Date(`${format(endDate, 'yyyy-MM-dd')}T${endTime}`),
      allDay: form.getValues('allDay'),
      resource: {
        ...initialEventData.resource,
        meetingLink: form.getValues('meetingLink') ?? '',
        description: editorContent,
        color:
          form.getValues('color') ?? initialEventData.resource?.color ?? 'hsl(var(--primary-500))',
        recurring: true,
        members: selectedMembers,
      },
    };

    window.localStorage.setItem('tempEditEvent', JSON.stringify(tempEventData));
    onNext();
  };

  return (
    <>
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="w-full sm:max-w-[720px] max-h-[96vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('EDIT_EVENT')}</DialogTitle>
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
                    <EventParticipant
                      selected={field.value ?? []}
                      editMembers={initialEventData.resource?.members}
                      onChange={field.onChange}
                    />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row w-full gap-4">
                <div className="flex gap-4 w-full sm:w-[60%]">
                  <div className="grid grid-cols-2 gap-4">
                    <DateTimePicker
                      date={startDate}
                      time={startTime}
                      isAllDay={isAllDay ?? false}
                      isTimeOpen={isStartTimeOpen}
                      timePickerRange={timePickerRange}
                      onDateChange={setStartDate}
                      onTimeChange={setStartTime}
                      onTimeOpenChange={(open) => {
                        setIsStartTimeOpen(open);
                        if (open && startRef.current) setStartWidth(startRef.current.offsetWidth);
                      }}
                      label={t('START_DATE')}
                      timeLabel={t('START_TIME')}
                      width={startWidth}
                      elementRef={startRef}
                    />
                    <DateTimePicker
                      date={endDate}
                      time={endTime}
                      isAllDay={isAllDay ?? false}
                      isTimeOpen={isEndTimeOpen}
                      timePickerRange={timePickerRange}
                      onDateChange={setEndDate}
                      onTimeChange={setEndTime}
                      onTimeOpenChange={(open) => {
                        setIsEndTimeOpen(open);
                        if (open && endRef.current) setEndWidth(endRef.current.offsetWidth);
                      }}
                      label={t('END_DATE')}
                      timeLabel={t('END_TIME')}
                      width={endWidth}
                      elementRef={endRef}
                    />
                  </div>
                </div>
                <Separator orientation="vertical" className="hidden sm:flex" />
                <div className="flex flex-col w-full sm:w-[40%] gap-4">
                  <FormField
                    control={form.control}
                    name="allDay"
                    render={({ field }) => (
                      <div className="flex items-center gap-4">
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <Label>{t('ALL_DAY')}</Label>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recurring"
                    render={({ field }) => (
                      <div className="flex items-center gap-4">
                        <Switch checked={field.value} onCheckedChange={handleRecurringToggle} />
                        <Label>{t('RECURRING_EVENT')}</Label>
                      </div>
                    )}
                  />
                  {form.watch('recurring') && (
                    <div className="flex items-center gap-4">
                      <CalendarClock className="w-5 h-5 text-medium-emphasis" />
                      <button
                        type="button"
                        onClick={handleRecurringClick}
                        className="bg-transparent border-none p-0 underline text-primary text-base cursor-pointer font-semibold hover:text-primary-800 min-h-[20px]"
                      >
                        {recurrenceText || t('SET_RECURRENCE') || 'Set Recurrence'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-base text-high-emphasis">{t('DESCRIPTION')}</p>
                <div className="flex flex-col flex-1">
                  {isMounted && editorComponent ? (
                    React.createElement(editorComponent, {
                      value: editorContent,
                      onChange: setEditorContent,
                      showIcons: false,
                    })
                  ) : (
                    <div className="border rounded-md p-4">{t('LOADING_EDITOR')}</div>
                  )}
                </div>
              </div>
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-base text-high-emphasis">{t('COLORS')}</p>
                    <ColorPickerTool selectedColor={field.value} onColorChange={field.onChange} />
                  </div>
                )}
              />
              <div className="flex w-full items-center justify-between gap-4 mt-6">
                <Button variant="outline" size="icon" type="button" onClick={handleDeleteClick}>
                  <Trash className="w-5 h-4 text-destructive" />
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" type="button" onClick={handleClose}>
                    {t('DISCARD')}
                  </Button>
                  <Button type="submit">{t('SAVE')}</Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <ConfirmationModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={t('DELETE_EVENT')}
        description={
          <>
            {t('ARE_YOU_SURE_WANT_DELETE_EVENT')}{' '}
            <span className="font-semibold text-high-emphasis">{initialEventData.title}</span>?{' '}
            {t('THIS_ACTION_CANNOT_UNDONE')}
          </>
        }
        onConfirm={handleDeleteConfirm}
      />
      <DeleteRecurringEvent
        open={showRecurringDeleteDialog}
        onOpenChange={setShowRecurringDeleteDialog}
        eventTitle={initialEventData.title}
        onConfirm={handleRecurringDeleteConfirm}
      />
      {showUpdateDialog && (
        <UpdateRecurringEvent
          open={showUpdateDialog}
          onOpenChange={setShowUpdateDialog}
          eventTitle={initialEventData.title}
          onConfirm={handleUpdateConfirm}
        />
      )}
    </>
  );
};
