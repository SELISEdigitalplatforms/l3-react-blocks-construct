import { useState } from 'react';
import { CalendarEvent, myEventsList } from 'features/big-calendar';
import { MEMBER_STATUS } from 'features/big-calendar/enums/calendar.enum';

/**
 * Hook for managing calendar events
 * Handles event creation, deletion, updates, filtering, and searching
 */
export const useCalendarEvents = () => {
  const [events, setEvents] = useState(myEventsList);
  const currentUserId = crypto.randomUUID();

  /**
   * Handle user response to an event invitation
   */
  const handleRespond = (eventId: string, status: MEMBER_STATUS) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.eventId !== eventId || !ev.resource) return ev;
        const updatedMembers = ev.resource.members?.map((m) =>
          m.id === currentUserId ? { ...m, status } : m
        );
        return {
          ...ev,
          resource: {
            ...ev.resource,
            members: updatedMembers,
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
  const addEvent = (data: any) => {
    if (data.events && Array.isArray(data.events) && data.events.length > 0) {
      setEvents((prev) => [...prev, ...data.events]);
      return true;
    } 
    
    const newEvent: CalendarEvent = {
      eventId: crypto.randomUUID(),
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
  const isSameRecurringSeries = (event: CalendarEvent, originalTitle: string, originalColor?: string) => 
    event.resource?.recurring &&
    event.title === originalTitle &&
    event.resource?.color === originalColor;

  /**
   * Delete an event or a recurring series of events
   */
  const deleteEvent = (eventId: string, deleteOption?: 'this' | 'thisAndFollowing' | 'all') => {
    const eventToDelete = events.find((event) => event.eventId === eventId);
    if (!eventToDelete) return;

    // Simple case: non-recurring event or delete just this occurrence
    if (!eventToDelete.resource?.recurring || deleteOption === 'this') {
      setEvents((prev) => prev.filter((event) => event.eventId !== eventId));
      return;
    }

    const originalTitle = eventToDelete.title;
    const originalColor = eventToDelete.resource?.color;

    // Delete this and all future occurrences
    if (deleteOption === 'thisAndFollowing') {
      const eventDate = new Date(eventToDelete.start);
      setEvents((prev) => 
        prev.filter((event) => {
          if (event.title !== originalTitle) return true;
          if (event.resource?.color !== originalColor) return true;

          if (!isSameRecurringSeries(event, originalTitle, originalColor)) return true;

          return new Date(event.start) < eventDate;
        })
      );
      return;
    }

    // Delete entire series
    if (deleteOption === 'all') {
      setEvents((prev) => 
        prev.filter((event) => {
          if (event.title !== originalTitle) return true;
          if (event.resource?.color !== originalColor) return true;

          return !isSameRecurringSeries(event, originalTitle, originalColor);
        })
      );
    }
  };

  /**
   * Update an existing event or recurring series
   */
  const updateEvent = (updatedEvent: CalendarEvent) => {
    // For recurring series updates (pattern changed or not), replace all recurring events
    if (
      updatedEvent.resource?.recurring &&
      Array.isArray(updatedEvent.events) &&
      updatedEvent.events.length > 0
    ) {
      const seriesEvents = updatedEvent.events;
      setEvents((prev) => {
        // Keep only non-recurring events
        const nonRecurring = prev.filter((ev) => !ev.resource?.recurring);
        // Append all series instances
        return [...nonRecurring, ...seriesEvents];
      });
      return;
    } 
    
    // This branch handles updates to a recurring event's properties
    // (title, description, etc.) without changing the recurrence pattern
    if (updatedEvent.resource?.recurring) {
      setEvents((prev) => {
        const eventToEdit = prev.find((event) => event.eventId === updatedEvent.eventId);

        if (!eventToEdit) {
          // If we can't find the event, just update the provided event
          return prev.map((event) =>
            event.eventId === updatedEvent.eventId ? updatedEvent : event
          );
        }

        // Identify properties to be updated in all events in the series
        const originalTitle = eventToEdit.title;
        const originalColor = eventToEdit.resource?.color;

        return prev.map((event) => {
          // Check if this event is part of the same recurring series
          if (!isSameRecurringSeries(event, originalTitle, originalColor)) {
            return event;
          }

          return {
            ...event,
            title: updatedEvent.title,
            allDay: updatedEvent.allDay,
            resource: {
              meetingLink: updatedEvent.resource?.meetingLink ?? event.resource?.meetingLink,
              description: updatedEvent.resource?.description ?? event.resource?.description,
              color: updatedEvent.resource?.color ?? event.resource?.color,
              members: updatedEvent.resource?.members ?? event.resource?.members,
              recurring: true,
            },
          };
        });
      });
      return;
    }

    // Handle non-recurring event updates
    setEvents((prev) =>
      prev.map((event) => (event.eventId === updatedEvent.eventId ? updatedEvent : event))
    );
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
    setEvents((prev) => 
      prev.map((ev) => (ev.eventId === tempEvent.eventId ? tempEvent : ev))
    );
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
  };
};
