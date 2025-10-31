import { useState } from 'react';
import { SlotInfo, Event } from 'react-big-calendar';
import { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop';
import { CalendarModalState } from '../enums/calendar.enum';
import { CalendarEvent } from '../types/calendar-event.types';

/**
 * Hook for managing calendar UI state
 * Handles modals, selected events, slots, and UI interactions
 */
export const useCalendarUI = () => {
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [currentDialog, setCurrentDialog] = useState<CalendarModalState>(CalendarModalState.NONE);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [tempEvent, setTempEvent] = useState<CalendarEvent | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /**
   * Close all modal dialogs
   */
  const closeAllModals = () => setCurrentDialog(CalendarModalState.NONE);

  /**
   * Create a default slot for adding new events
   */
  const createDefaultSlot = (date: Date = new Date()): SlotInfo => ({
    start: date,
    end: date,
    slots: [],
    action: 'click',
  });

  /**
   * Handle event selection
   */
  const handleSelectEvent = (value: any) => {
    if (value instanceof Date) {
      setSelectedSlot(createDefaultSlot(value));
    } else {
      setSelectedEvent(value as CalendarEvent);
      setCurrentDialog(CalendarModalState.EVENT_DETAIL);
    }
  };

  /**
   * Handle event drag or resize
   */
  const handleEventInteraction = (args: EventInteractionArgs<Event>) => {
    const { event, start, end, isAllDay } = args;
    const calendarEvent = event as unknown as CalendarEvent;
    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);

    setTempEvent({
      ...calendarEvent,
      start: startDate,
      end: endDate,
      allDay: isAllDay,
    });
    setShowConfirmModal(true);
  };

  /**
   * Navigate to edit event dialog
   */
  const navigateToEditEvent = () => setCurrentDialog(CalendarModalState.EDIT_EVENT);

  /**
   * Navigate to recurrence dialog
   */
  const navigateToRecurrence = () => setCurrentDialog(CalendarModalState.EVENT_RECURRENCE);

  /**
   * Update selected event with recurring flag
   */
  const updateSelectedEventRecurring = () => {
    if (selectedEvent) {
      setSelectedEvent({
        ...selectedEvent,
        resource: {
          ...selectedEvent.resource,
          recurring: true,
        },
      });
    }
    setCurrentDialog(CalendarModalState.EDIT_EVENT);
  };

  /**
   * Update selected event with recurring events
   */
  const updateSelectedEventWithRecurringEvents = (recurringEvents: CalendarEvent[]) => {
    if (!selectedEvent || !Array.isArray(recurringEvents) || recurringEvents.length === 0) return;

    const processedRecurringEvents = recurringEvents.map((event) => ({
      ...event,
      start: event.start instanceof Date ? event.start : new Date(event.start),
      end: event.end instanceof Date ? event.end : new Date(event.end),
      resource: {
        ...event.resource,
        color: selectedEvent.resource?.color ?? event.resource?.color ?? 'hsl(var(--primary-500))',
      },
    }));

    const updatedEvent: CalendarEvent = {
      ...selectedEvent,
      events: processedRecurringEvents,
      resource: {
        ...selectedEvent.resource,
        recurring: true,
      },
    };

    setSelectedEvent(updatedEvent);
  };

  /**
   * Confirm event position change after drag or resize
   */
  const confirmEventPositionChange = (onConfirm: (event: CalendarEvent) => void) => {
    if (!tempEvent) return;

    onConfirm(tempEvent);
    setShowConfirmModal(false);
    setTempEvent(null);
  };

  return {
    selectedSlot,
    setSelectedSlot,
    currentDialog,
    selectedEvent,
    tempEvent,
    showConfirmModal,
    setShowConfirmModal,
    closeAllModals,
    createDefaultSlot,
    handleSelectEvent,
    handleEventInteraction,
    navigateToEditEvent,
    navigateToRecurrence,
    updateSelectedEventRecurring,
    updateSelectedEventWithRecurringEvents,
    confirmEventPositionChange,
  };
};
