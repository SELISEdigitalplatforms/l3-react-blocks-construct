import { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { endOfDay, format, startOfDay } from 'date-fns';
import { CalendarClock, CalendarIcon, Trash, ChevronDown } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from 'components/ui/form';
import { Input } from 'components/ui/input';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
} from 'components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
  Close as PopoverClose,
} from 'components/ui/popover';
import { Separator } from 'components/ui/separator';
import { Switch } from 'components/ui/switch';
import { Calendar } from 'components/ui/calendar';
import { Label } from 'components/ui/label';
import CustomTextEditor from 'components/blocks/custom-text-editor/custom-text-editor';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';
import { useToast } from 'hooks/use-toast';
import { AddEventFormValues, formSchema } from '../../../utils/form-schema';
import { ColorPickerTool } from '../../color-picker-tool/color-picker-tool';
import { CalendarEvent, Member } from '../../../types/calendar-event.types';
import { EventParticipant } from '../../event-participant/event-participant';
import { members } from '../../../services/calendar-services';
import { DeleteRecurringEvent } from '../delete-recurring-event/delete-recurring-event';
import { generateTimePickerRange } from '../../../utils/date-utils';
import { useCalendarSettings } from '../../../contexts/calendar-settings.context';
import { WEEK_DAYS } from '../../../constants/calendar.constants';

type DeleteOption = 'this' | 'thisAndFollowing' | 'all';

interface EditEventProps {
  event: CalendarEvent;
  onClose: () => void;
  onNext: () => void;
  onUpdate: (event: CalendarEvent) => void;
  onDelete: (eventId: string, deleteOption?: DeleteOption) => void;
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
 * @param {(eventId: string) => void} onDelete - Callback to delete the event by ID
 *
 * @returns {JSX.Element} Edit event modal dialog with form fields and action buttons
 *
 * @example
 * <EditEvent
 *   event={selectedEvent}
 *   onClose={() => setShowModal(false)}
 *   onNext={() => handleRecurrenceConfig()}
 *   onUpdate={updateEventInState}
 *   onDelete={deleteEventById}
 * />
 */
export function EditEvent({
  event,
  onClose,
  onNext,
  onUpdate,
  onDelete,
}: Readonly<EditEventProps>) {
  const { toast } = useToast();
  const [initialEventData] = useState<CalendarEvent>(() => {
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
          resource: {
            ...parsed.resource,
          },
        } as CalendarEvent;
      }
    }
    return event;
  });
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
  const [recurringEvents, setRecurringEvents] = useState<CalendarEvent[]>(
    initialEventData.events || []
  );

  useEffect(() => {
    if (initialEventData.resource?.recurring) {
      const tempEdit = window.localStorage.getItem('tempEditEvent');
      if (tempEdit) {
        try {
          const parsedEdit = JSON.parse(tempEdit) as CalendarEvent;
          if (parsedEdit.events && parsedEdit.events.length > 1) {
            setRecurringEvents(
              parsedEdit.events.map((evt) => ({
                ...evt,
                start: new Date(evt.start),
                end: new Date(evt.end),
              }))
            );
            return;
          }
        } catch (error) {
          console.error('Error parsing tempEditEvent', error);
        }
      }

      const tempSeries = window.localStorage.getItem('tempRecurringEvents');

      if (tempSeries) {
        try {
          const parsedEvents = JSON.parse(tempSeries as string);
          setRecurringEvents(
            parsedEvents.map((evt: any) => ({
              ...evt,
              start: new Date(evt.start),
              end: new Date(evt.end),
            }))
          );
        } catch (error) {
          console.error('Error parsing tempRecurringEvents', error);
        }
      }
    }
  }, [initialEventData.resource?.recurring]);

  useEffect(() => {
    if (
      initialEventData.resource?.recurring &&
      (!initialEventData.events || initialEventData.events.length <= 1)
    ) {
      const tempSeries = window.localStorage.getItem('tempRecurringEvents');
      if (tempSeries) {
        try {
          setRecurringEvents(
            JSON.parse(tempSeries as string).map((evt: any) => ({
              ...evt,
              start: new Date(evt.start),
              end: new Date(evt.end),
            }))
          );
        } catch (error) {
          console.error('Error parsing tempRecurringEvents', error);
        }
      }
    }
  }, [initialEventData.resource?.recurring, initialEventData.events]);

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

  const isAllDay = form.watch('allDay');

  const recurrenceText = useMemo(() => {
    if (!form.watch('recurring')) return '';

    const evts = recurringEvents.length > 0 ? recurringEvents : initialEventData.events || [];
    const targetDate = evts.length > 0 ? new Date(evts[0].start) : startDate;
    return `Occurs on ${WEEK_DAYS[targetDate.getDay()]}`;
  }, [form, recurringEvents, initialEventData.events, startDate]);

  const handleClose = () => {
    window.localStorage.removeItem('tempEditEvent');
    window.localStorage.removeItem('tempRecurringEvents');
    onClose();
  };

  useEffect(() => {
    // Check for saved data in localStorage again (in case it was updated after initialEventData was set)
    const savedEventData = window.localStorage.getItem('tempEditEvent');

    if (savedEventData) {
      const parsed = JSON.parse(savedEventData) as CalendarEvent;
      const parsedSavedStart = new Date(parsed.start);
      const parsedSavedEnd = new Date(parsed.end);

      // Reset form with all saved values
      form.reset({
        title: parsed.title,
        meetingLink: parsed.resource?.meetingLink || '',
        start: parsedSavedStart.toISOString().slice(0, 16),
        end: parsedSavedEnd.toISOString().slice(0, 16),
        allDay: parsed.allDay ?? false,
        color: parsed.resource?.color ?? '',
        description: parsed.resource?.description ?? '',
        recurring: parsed.resource?.recurring ?? false,
        members: parsed.resource?.members ? parsed.resource.members.map((m) => m.id) : [],
      });

      // Update other state values
      setStartDate(parsedSavedStart);
      setEndDate(parsedSavedEnd);
      setStartTime(format(parsedSavedStart, 'HH:mm'));
      setEndTime(format(parsedSavedEnd, 'HH:mm'));
      setEditorContent(parsed.resource?.description ?? '');
      // Load tempEditEvent events
      let evts: CalendarEvent[] = [];
      const tempEdit = window.localStorage.getItem('tempEditEvent');
      if (tempEdit) {
        try {
          const parsedEdit = JSON.parse(tempEdit) as CalendarEvent;
          evts =
            parsedEdit.events?.map((evt) => ({
              ...evt,
              start: new Date(evt.start),
              end: new Date(evt.end),
            })) || [];
        } catch (error) {
          console.error('Error parsing tempEditEvent', error);
        }
      }
      if (evts.length < 2) {
        const tempRec = window.localStorage.getItem('tempRecurringEvents');
        if (tempRec) {
          try {
            const parsedRec = JSON.parse(tempRec) as CalendarEvent[];
            evts = parsedRec.map((evt) => ({
              ...evt,
              start: new Date(evt.start),
              end: new Date(evt.end),
            }));
          } catch (error) {
            console.error('Error parsing tempRecurringEvents', error);
          }
        }
      }
      setRecurringEvents(evts);
    } else {
      form.reset({
        title: initialEventData.title,
        meetingLink: initialEventData.resource?.meetingLink || '',
        start: parsedStart.toISOString().slice(0, 16),
        end: parsedEnd.toISOString().slice(0, 16),
        allDay: initialEventData.allDay ?? false,
        color: initialEventData.resource?.color ?? '',
        description: initialEventData.resource?.description ?? '',
        recurring: initialEventData.resource?.recurring ?? false,
        members:
          (initialEventData.resource?.members
            ? initialEventData.resource.members.map((m) => m.id)
            : []) || [],
      });

      setStartDate(parsedStart);
      setEndDate(parsedEnd);
      setStartTime(format(parsedStart, 'HH:mm'));
      setEndTime(format(parsedEnd, 'HH:mm'));
      setEditorContent(initialEventData.resource?.description ?? '');
    }
  }, [initialEventData, form, parsedStart, parsedEnd]);

  const onSubmit = (data: AddEventFormValues) => {
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
          title: 'Invalid Date/Time',
          description: 'Please select valid start and end times.',
        });
        return;
      }

      const selectedMembers: Member[] = memberIds
        .map((id) =>
          [...members, ...(initialEventData.resource?.members ?? [])]?.find(
            (member) => member?.id === id
          )
        )
        .filter((member): member is Member => Boolean(member));

      const tempRecurringEvents = window.localStorage.getItem('tempRecurringEvents');

      let updatedEvent: CalendarEvent = {
        ...initialEventData,
        title: data.title,
        start: startDateTime,
        end: endDateTime,
        allDay: data.allDay,
        events: undefined,
        resource: {
          meetingLink: data.meetingLink ?? '',
          color: data.color || initialEventData.resource?.color || 'hsl(var(--primary-500))',
          description: editorContent,
          recurring: false,
          patternChanged: undefined,
          members: selectedMembers,
        },
      };

      if (data.recurring) {
        if (tempRecurringEvents) {
          try {
            const parsedRecurringEvents = JSON.parse(tempRecurringEvents) as CalendarEvent[];

            const processedRecurringEvents = parsedRecurringEvents.map((evt) => ({
              ...evt,
              title: data.title,
              start: evt.start instanceof Date ? evt.start : new Date(evt.start),
              end: evt.end instanceof Date ? evt.end : new Date(evt.end),
              allDay: data.allDay,
              resource: {
                meetingLink: data.meetingLink ?? '',
                description: editorContent,
                color: data.color || initialEventData.resource?.color || 'hsl(var(--primary-500))',
                recurring: true,
                members: selectedMembers,
              },
            }));

            updatedEvent = {
              ...initialEventData,
              title: data.title,
              start: startDateTime,
              end: endDateTime,
              allDay: data.allDay,
              events: processedRecurringEvents,
              resource: {
                meetingLink: data.meetingLink ?? '',
                color: data.color || initialEventData.resource?.color || 'hsl(var(--primary-500))',
                description: editorContent,
                recurring: true,
                patternChanged: true,
                members: selectedMembers,
              },
            };
          } catch (error) {
            console.error('Error processing recurring events:', error);
            toast({
              variant: 'destructive',
              title: 'Error Processing Recurring Events',
              description: 'There was an error processing the recurring events. Please try again.',
            });
            return;
          }
        } else {
          console.warn('No tempRecurringEvents found in localStorage'); // Debug log
          toast({
            variant: 'destructive',
            title: 'Missing Recurring Events Data',
            description:
              'Could not find recurring events data. Please try configuring the recurrence again.',
          });
          return;
        }
      }

      const finalUpdatedEvent = {
        ...updatedEvent,
        start:
          updatedEvent.start instanceof Date ? updatedEvent.start : new Date(updatedEvent.start),
        end: updatedEvent.end instanceof Date ? updatedEvent.end : new Date(updatedEvent.end),
        events: updatedEvent.events
          ? updatedEvent.events.map((evt) => ({
              ...evt,
              start: evt.start instanceof Date ? evt.start : new Date(evt.start),
              end: evt.end instanceof Date ? evt.end : new Date(evt.end),
            }))
          : undefined,
      };

      window.localStorage.removeItem('tempEditEvent');
      window.localStorage.removeItem('tempRecurringEvents');

      onUpdate(finalUpdatedEvent);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: 'destructive',
        title: 'Error Saving Event',
        description: 'There was an error saving your event. Please try again.',
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

  const handleDeleteConfirm = () => {
    onDelete(initialEventData.eventId ?? '');
    onClose();
    setShowDeleteDialog(false);
    toast({
      variant: 'success',
      title: 'Event Deleted Successfully',
      description: 'The event has been removed from your calendar.',
    });
  };

  const handleRecurringDeleteConfirm = (deleteOption: DeleteOption) => {
    onDelete(initialEventData.eventId ?? '', deleteOption);
    onClose();
    setShowRecurringDeleteDialog(false);
    toast({
      variant: 'success',
      title: 'Recurring Event Deleted',
      description: 'The recurring event has been removed from your calendar.',
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

  return (
    <>
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="w-full sm:max-w-[720px] max-h-[96vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-sm">Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="meetingLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-sm">Meeting Link*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your meeting link" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="members"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-sm">Participants</FormLabel>
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
                    <div className="flex flex-col gap-[6px]">
                      <Label className="font-normal text-sm">Start date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="relative">
                            <Input
                              readOnly
                              value={startDate ? format(startDate, 'dd.MM.yyyy') : ''}
                              className="cursor-pointer"
                            />
                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-emphasis" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(day) => setStartDate(day || new Date())}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {!isAllDay && (
                      <div className="flex flex-col gap-[6px]">
                        <Label className="font-normal text-sm">Start time</Label>
                        <Popover
                          modal={true}
                          open={isStartTimeOpen}
                          onOpenChange={(open) => {
                            setIsStartTimeOpen(open);
                            if (open && startRef.current)
                              setStartWidth(startRef.current.offsetWidth);
                          }}
                        >
                          <PopoverAnchor asChild>
                            <div ref={startRef} className="relative w-full">
                              <Input
                                type="time"
                                step="60"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
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
                            style={
                              startWidth > 0
                                ? { width: startWidth, boxSizing: 'border-box' }
                                : undefined
                            }
                          >
                            {timePickerRange.map((time) => (
                              <PopoverClose asChild key={time}>
                                <div
                                  onClick={() => setStartTime(time)}
                                  className="cursor-pointer px-3 py-1 hover:bg-accent hover:text-accent-foreground"
                                >
                                  {time}
                                </div>
                              </PopoverClose>
                            ))}
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                    <div className="flex flex-col gap-[6px]">
                      <Label className="font-normal text-sm">End date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="relative">
                            <Input
                              readOnly
                              value={endDate ? format(endDate, 'dd.MM.yyyy') : ''}
                              className="cursor-pointer"
                            />
                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-emphasis" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(day) => setEndDate(day || new Date())}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {!isAllDay && (
                      <div className="flex flex-col gap-[6px]">
                        <Label className="font-normal text-sm">End time</Label>
                        <Popover
                          modal={true}
                          open={isEndTimeOpen}
                          onOpenChange={(open) => {
                            setIsEndTimeOpen(open);
                            if (open && endRef.current) setEndWidth(endRef.current.offsetWidth);
                          }}
                        >
                          <PopoverAnchor asChild>
                            <div ref={endRef} className="relative w-full">
                              <Input
                                type="time"
                                step="60"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
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
                            style={
                              endWidth > 0
                                ? { width: endWidth, boxSizing: 'border-box' }
                                : undefined
                            }
                          >
                            {timePickerRange.map((time) => (
                              <PopoverClose asChild key={time}>
                                <div
                                  onClick={() => setEndTime(time)}
                                  className="cursor-pointer px-3 py-1 hover:bg-accent hover:text-accent-foreground"
                                >
                                  {time}
                                </div>
                              </PopoverClose>
                            ))}
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
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
                        <Label>All day</Label>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recurring"
                    render={({ field }) => (
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              // Initialize recurring events if none exist
                              if (!recurringEvents.length) {
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
                            }
                          }}
                        />
                        <Label>Recurring Event</Label>
                      </div>
                    )}
                  />
                  {form.watch('recurring') && (
                    <div className="flex items-center gap-4">
                      <CalendarClock className="w-5 h-5 text-medium-emphasis" />
                      <a
                        onClick={() => {
                          const memberIds = form.getValues('members') ?? [];
                          const selectedMembers: Member[] = memberIds
                            .map((id) =>
                              [...members, ...(initialEventData.resource?.members ?? [])].find(
                                (member) => member.id === id
                              )
                            )
                            .filter((m): m is Member => Boolean(m));
                          // Store complete form state before navigating
                          const tempEventData: CalendarEvent = {
                            // Preserve all current recurrence series events
                            events: recurringEvents,
                            ...initialEventData,
                            title: form.getValues('title') || initialEventData.title,
                            start: new Date(`${format(startDate, 'yyyy-MM-dd')}T${startTime}`),
                            end: new Date(`${format(endDate, 'yyyy-MM-dd')}T${endTime}`),
                            allDay: form.getValues('allDay'),
                            resource: {
                              ...initialEventData.resource,
                              meetingLink: form.getValues('meetingLink') || '',
                              description: editorContent,
                              color:
                                form.getValues('color') ||
                                initialEventData.resource?.color ||
                                'hsl(var(--primary-500))',
                              recurring: true,
                              members: selectedMembers,
                            },
                          };
                          window.localStorage.setItem(
                            'tempEditEvent',
                            JSON.stringify(tempEventData)
                          );
                          onNext();
                        }}
                        className="underline text-primary text-base cursor-pointer font-semibold hover:text-primary-800"
                      >
                        {recurrenceText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-base text-high-emphasis">Description</p>
                <div className="flex flex-col flex-1">
                  <CustomTextEditor
                    value={editorContent}
                    onChange={setEditorContent}
                    showIcons={false}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-base text-high-emphasis">Colors</p>
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
                    Discard
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <ConfirmationModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Event"
        description={
          <>
            Are you sure you want to delete the event:{' '}
            <span className="font-semibold text-high-emphasis">{initialEventData.title}</span>? This
            action cannot be undone.
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
    </>
  );
}
