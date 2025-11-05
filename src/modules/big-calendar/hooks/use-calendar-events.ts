import { useState, useRef } from 'react';
import { generateUuid } from '@/utils/uuid';
import { myEventsList } from '../services/calendar-services';
import { CalendarEvent, DeleteUpdateEventOption, Member } from '../types/calendar-event.types';
import { MEMBER_STATUS } from '../enums/calendar.enum';

/**
 * Hook for managing calendar events
 * Handles event creation, deletion, updates, filtering, and searching
 */
export const useCalendarEvents = () => {
  const [events, setEvents] = useState(myEventsList);
  // Store the last deleted event and related information for undo functionality
  // Using useRef instead of useState to ensure the value persists between renders
  const lastDeletedEventRef = useRef<CalendarEvent | null>(null);
  // Store the original events list before deletion to ensure proper restoration
  const eventsBeforeDeletionRef = useRef<CalendarEvent[]>([]);
  const currentUserId = generateUuid();

  /**
   * Update the status of a member in an event
   */
  const updateMemberStatus = (members: Member[] | undefined, newStatus: MEMBER_STATUS) => {
    if (!members) return undefined;
    return members.map(
      (member: { id: string; status?: MEMBER_STATUS; name: string; image: string }) => ({
        ...member,
        status:
          member.id === currentUserId ? newStatus : (member.status ?? MEMBER_STATUS.NORESPONSE),
      })
    );
  };

  /**
   * Handle user response to an event invitation
   */
  const handleRespond = (eventId: string, status: MEMBER_STATUS) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.eventId !== eventId || !ev.resource) return ev;

        return {
          ...ev,
          resource: {
            ...ev.resource,
            members: updateMemberStatus(ev.resource.members, status),
            invitationAccepted: status === MEMBER_STATUS.ACCEPTED,
          },
        };
      })
    );
  };

  /**
   * Filter events based on search query
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvents(() => {
      const searchFilter = [...myEventsList].filter((res) =>
        res.title.toLowerCase().includes(e.target.value.toLowerCase())
      );
      return searchFilter;
    });
  };

  /**
   * Add a new event or multiple events to the calendar
   */
  const addEvent = (data: any): boolean => {
    if (data.events && Array.isArray(data.events) && data.events.length > 0) {
      setEvents((prev) => [...prev, ...data.events]);
      return true;
    }
    if (!data.title || !data.start || !data.end) {
      return false;
    }

    const newEvent: CalendarEvent = {
      eventId: generateUuid(),
      title: data.title,
      start: new Date(data.start),
      end: new Date(data.end),
      allDay: data.allDay,
      resource: {
        color: data?.color,
        description: data?.description,
        meetingLink: data?.meetingLink,
        recurring: data?.recurring,
        members: data?.members,
      },
    };
    setEvents((prev) => [...prev, newEvent]);
    return true;
  };

  /**
   * Helper function to check if an event is part of a recurring series
   */
  const isSameRecurringSeries = (
    event: CalendarEvent,
    originalTitle: string,
    originalColor?: string
  ) =>
    event.resource?.recurring &&
    event.title === originalTitle &&
    event.resource?.color === originalColor;

  /**
   * Delete an event from the calendar
   * @param eventId - ID of the event to delete
   * @param deleteOption - Option for recurring events ('this', 'thisAndFollowing', 'all')
   */
  const deleteEvent = (eventId: string, deleteOption?: DeleteUpdateEventOption) => {
    // Find the event to delete
    const eventToDelete = events.find((event) => event.eventId === eventId);
    if (!eventToDelete) {
      return;
    }

    // Store the current events list before deletion for proper restoration
    const eventsCopy = [...events];
    eventsBeforeDeletionRef.current = eventsCopy;

    // Store the deleted event for potential restoration
    const deletedEventCopy = JSON.parse(JSON.stringify(eventToDelete));
    lastDeletedEventRef.current = deletedEventCopy;

    // Get the original title and color for recurring event identification
    const originalTitle = eventToDelete.title;
    const originalColor = eventToDelete.resource?.color;

    // Create a new events array without the deleted event
    let updatedEvents: CalendarEvent[] = [];

    // Simple case: non-recurring event or delete just this occurrence
    if (!eventToDelete.resource?.recurring || deleteOption === 'this') {
      updatedEvents = events.filter((event) => event.eventId !== eventId);
      setEvents(updatedEvents);
      return;
    }

    // Delete this and all future occurrences
    if (deleteOption === 'thisAndFollowing') {
      const eventDate = new Date(eventToDelete.start);

      updatedEvents = events.filter((event) => {
        if (event.title !== originalTitle) return true;
        if (event.resource?.color !== originalColor) return true;
        if (!isSameRecurringSeries(event, originalTitle, originalColor)) return true;

        return new Date(event.start) < eventDate;
      });

      setEvents(updatedEvents);
      return;
    }

    // Delete all occurrences of this recurring event
    if (deleteOption === 'all') {
      updatedEvents = events.filter(
        (event) =>
          event.title !== originalTitle ||
          event.resource?.color !== originalColor ||
          !isSameRecurringSeries(event, originalTitle, originalColor)
      );

      setEvents(updatedEvents);
      return;
    }

    // Default case - shouldn't reach here but just in case
    updatedEvents = events.filter((event) => event.eventId !== eventId);
    setEvents(updatedEvents);
  };

  /**
   * Update an event or a recurring series of events
   */
  const updateEvent = (updatedEvent: CalendarEvent, updateOption?: DeleteUpdateEventOption) => {
    const eventToUpdate = events.find((event) => event.eventId === updatedEvent.eventId);
    if (!eventToUpdate) return;

    // Simple case: non-recurring event or update just this occurrence
    if (!eventToUpdate.resource?.recurring || updateOption === 'this') {
      setEvents((prev) =>
        prev.map((event) => (event.eventId === updatedEvent.eventId ? updatedEvent : event))
      );
      return;
    }

    const originalTitle = eventToUpdate.title;
    const originalColor = eventToUpdate.resource?.color;

    // Update this and all future occurrences
    if (updateOption === 'thisAndFollowing') {
      const eventDate = new Date(eventToUpdate.start);
      setEvents((prev) =>
        prev.map((event) => {
          if (event.title !== originalTitle) return event;
          if (event.resource?.color !== originalColor) return event;

          if (!isSameRecurringSeries(event, originalTitle, originalColor)) return event;

          if (new Date(event.start) < eventDate) return event;

          return {
            ...event,
            title: updatedEvent.title,
            allDay: updatedEvent.allDay,
            resource: {
              ...event.resource,
              meetingLink: updatedEvent.resource?.meetingLink ?? event.resource?.meetingLink,
              description: updatedEvent.resource?.description ?? event.resource?.description,
              color: updatedEvent.resource?.color ?? event.resource?.color,
              members: updatedEvent.resource?.members ?? event.resource?.members,
              recurring: true,
              recurrencePattern:
                updatedEvent.resource?.recurrencePattern ?? event.resource?.recurrencePattern,
              patternChanged:
                updatedEvent.resource?.patternChanged ?? event.resource?.patternChanged,
            },
          };
        })
      );
      return;
    }

    // Update entire series
    if (updateOption === 'all') {
      // If we have new events to add, replace the entire series
      if (Array.isArray(updatedEvent.events) && updatedEvent.events.length > 0) {
        setEvents((prev) => {
          // Remove old series
          const filteredEvents = prev.filter((event) => {
            if (event.title !== originalTitle) return true;
            if (event.resource?.color !== originalColor) return true;
            return !isSameRecurringSeries(event, originalTitle, originalColor);
          });
          // Add new series
          return [...filteredEvents, ...(updatedEvent.events as CalendarEvent[])];
        });
      } else {
        // Update existing events in the series
        setEvents((prev) => {
          return prev.map((event) => {
            if (event.title !== originalTitle) return event;
            if (event.resource?.color !== originalColor) return event;
            if (!isSameRecurringSeries(event, originalTitle, originalColor)) return event;

            return {
              ...event,
              title: updatedEvent.title,
              allDay: updatedEvent.allDay,
              resource: {
                ...event.resource,
                meetingLink: updatedEvent.resource?.meetingLink ?? event.resource?.meetingLink,
                description: updatedEvent.resource?.description ?? event.resource?.description,
                color: updatedEvent.resource?.color ?? event.resource?.color,
                members: updatedEvent.resource?.members ?? event.resource?.members,
                recurring: true,
                recurrencePattern:
                  updatedEvent.resource?.recurrencePattern ?? event.resource?.recurrencePattern,
                patternChanged:
                  updatedEvent.resource?.patternChanged ?? event.resource?.patternChanged,
              },
            };
          });
        });
      }
    }
  };

  /**
   * Filter events based on date range and color
   */
  const filterEvents = (filters: { dateRange: any; color: string | null }) => {
    setEvents(() => {
      const filteredEvents = [...myEventsList].filter((event) => {
        const eventDate = new Date(event.start);
        const startDate = filters.dateRange?.from;
        const endDate = filters.dateRange?.to;
        const colorMatch = !filters.color || event.resource?.color === filters.color;

        if (startDate && endDate) {
          return eventDate >= startDate && eventDate <= endDate && colorMatch;
        }

        return colorMatch;
      });
      return filteredEvents;
    });
  };

  /**
   * Update event after drag or resize
   */
  const updateEventPosition = (tempEvent: CalendarEvent) => {
    setEvents((prev) => prev.map((ev) => (ev.eventId === tempEvent.eventId ? tempEvent : ev)));
  };

  /**
   * Restore the last deleted event
   * Uses the events snapshot from before deletion to restore the exact state
   */
  const restoreEvent = () => {
    if (
      !lastDeletedEventRef.current ||
      !eventsBeforeDeletionRef.current ||
      eventsBeforeDeletionRef.current.length === 0
    ) {
      return false;
    }

    const eventsToRestore = JSON.parse(JSON.stringify(eventsBeforeDeletionRef.current));
    const processedEvents = eventsToRestore.map((event: CalendarEvent) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));

    setEvents(processedEvents);

    lastDeletedEventRef.current = null;
    eventsBeforeDeletionRef.current = [];

    return true;
  };

  return {
    events,
    currentUserId,
    handleRespond,
    handleSearch,
    addEvent,
    deleteEvent,
    updateEvent,
    filterEvents,
    updateEventPosition,
    lastDeletedEventRef,
    restoreEvent,
  };
};
