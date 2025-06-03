import { CalendarEvent } from '../types/calendar-event.types';
import { EventResource } from '../types/event-resource.types';

type DeleteOption = 'this' | 'thisAndFollowing' | 'all';

interface StoredEventData {
  event: CalendarEvent;
  expiresAt: number;
  deleteOption?: DeleteOption;
  relatedEvents?: CalendarEvent[];
}

/**
 * Configuration for the DeletedEventStorage service
 */
const config = {
  STORAGE_KEY: 'deletedCalendarEvents',
  DEFAULT_TTL: 10000, // 10 seconds for undo window
  CLEANUP_INTERVAL: 30000, // 30 seconds between cleanup cycles
} as const;

/**
 * Service for managing temporarily stored deleted calendar events.
 * Provides TTL-based storage and automatic cleanup of expired events.
 * Supports both single and recurring events.
 */
class DeletedEventStorage {
  private static instance: DeletedEventStorage;
  private cleanupInterval: NodeJS.Timeout;

  private constructor() {
    this.initializeCleanup();
  }

  /**
   * Initialize the cleanup mechanism for expired events
   */
  private initializeCleanup(): void {
    // Initial cleanup
    this.cleanupExpiredEvents();
    
    // Setup periodic cleanup
    this.cleanupInterval = setInterval(
      () => this.cleanupExpiredEvents(),
      config.CLEANUP_INTERVAL
    );
  }

  /**
   * Get the singleton instance of DeletedEventStorage
   */
  public static getInstance(): DeletedEventStorage {
    if (!DeletedEventStorage.instance) {
      DeletedEventStorage.instance = new DeletedEventStorage();
    }
    return DeletedEventStorage.instance;
  }

  /**
   * Store a deleted event with expiration time
   * @param event The calendar event to store
   * @param deleteOption Optional deletion type for recurring events
   * @param relatedEvents Optional related events for recurring series
   * @param ttl Optional custom TTL in milliseconds
   */
  public storeDeletedEvent(
    event: CalendarEvent,
    deleteOption?: DeleteOption,
    relatedEvents?: CalendarEvent[],
    ttl: number = config.DEFAULT_TTL
  ): void {
    try {
      if (!event.eventId) {
        throw new Error('Event ID is required');
      }

      const storedEvents = this.getStoredEvents();
      const expiresAt = Date.now() + ttl;

      const eventData: StoredEventData = {
        event: this.normalizeEventDates(event),
        expiresAt,
        deleteOption,
        relatedEvents: relatedEvents?.map(evt => this.normalizeEventDates(evt))
      };

      storedEvents.set(event.eventId, eventData);
      this.saveEvents(storedEvents);
    } catch (error) {
      console.error('Failed to store deleted event:', error);
      throw new Error('Failed to store deleted event');
    }
  }

  /**
   * Retrieve a stored deleted event
   * @param eventId The ID of the event to retrieve
   * @returns The stored event data if found and not expired, null otherwise
   */
  public getDeletedEvent(eventId: string): StoredEventData | null {
    try {
      const storedEvents = this.getStoredEvents();
      const eventData = storedEvents.get(eventId);

      if (!eventData) return null;

      // Check if event has expired
      if (Date.now() > eventData.expiresAt) {
        this.removeDeletedEvent(eventId);
        return null;
      }

      // Denormalize dates before returning
      return {
        ...eventData,
        event: this.denormalizeEventDates(eventData.event),
        relatedEvents: eventData.relatedEvents?.map(evt => 
          this.denormalizeEventDates(evt)
        )
      };
    } catch (error) {
      console.error('Failed to retrieve deleted event:', error);
      return null;
    }
  }

  /**
   * Remove a specific deleted event from storage
   * @param eventId The ID of the event to remove
   */
  public removeDeletedEvent(eventId: string): void {
    try {
      const storedEvents = this.getStoredEvents();
      storedEvents.delete(eventId);
      this.saveEvents(storedEvents);
    } catch (error) {
      console.error('Failed to remove deleted event:', error);
    }
  }

  /**
   * Clean up all expired events from storage
   */
  public cleanupExpiredEvents(): void {
    try {
      const storedEvents = this.getStoredEvents();
      const now = Date.now();
      let hasExpired = false;

      for (const [eventId, eventData] of storedEvents.entries()) {
        if (now > eventData.expiresAt) {
          storedEvents.delete(eventId);
          hasExpired = true;
        }
      }

      if (hasExpired) {
        this.saveEvents(storedEvents);
      }
    } catch (error) {
      console.error('Failed to cleanup expired events:', error);
    }
  }

  /**
   * Convert Date objects to ISO strings for storage
   */
  private normalizeEventDates(event: CalendarEvent): CalendarEvent {
    const normalizedEvent = {
      ...event,
      start: event.start instanceof Date ? event.start.toISOString() : event.start,
      end: event.end instanceof Date ? event.end.toISOString() : event.end,
    };

    if (event.resource) {
      normalizedEvent.resource = {
        ...event.resource,
        startDate: event.resource.startDate instanceof Date 
          ? event.resource.startDate.toISOString() 
          : event.resource.startDate,
        endDate: event.resource.endDate instanceof Date 
          ? event.resource.endDate.toISOString() 
          : event.resource.endDate,
        recurrence: event.resource.recurrence 
          ? {
              ...event.resource.recurrence,
              until: event.resource.recurrence.until instanceof Date 
                ? event.resource.recurrence.until.toISOString() 
                : event.resource.recurrence.until
            }
          : undefined
      };
    }

    return normalizedEvent;
  }

  /**
   * Convert ISO date strings back to Date objects
   */
  private denormalizeEventDates(event: CalendarEvent): CalendarEvent {
    const denormalizedEvent = {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    };

    if (event.resource) {
      denormalizedEvent.resource = {
        ...event.resource,
        startDate: event.resource.startDate ? new Date(event.resource.startDate) : undefined,
        endDate: event.resource.endDate ? new Date(event.resource.endDate) : undefined,
        recurrence: event.resource.recurrence 
          ? {
              ...event.resource.recurrence,
              until: event.resource.recurrence.until 
                ? new Date(event.resource.recurrence.until)
                : undefined
            }
          : undefined
      };
    }

    return denormalizedEvent;
  }

  /**
   * Retrieve all stored events from localStorage
   */
  private getStoredEvents(): Map<string, StoredEventData> {
    try {
      const stored = localStorage.getItem(config.STORAGE_KEY);
      if (!stored) return new Map();

      const parsed = JSON.parse(stored);
      return new Map(Object.entries(parsed));
    } catch (error) {
      console.error('Failed to get stored events:', error);
      return new Map();
    }
  }

  /**
   * Save events map to localStorage
   */
  private saveEvents(events: Map<string, StoredEventData>): void {
    try {
      const eventsObject = Object.fromEntries(events);
      localStorage.setItem(config.STORAGE_KEY, JSON.stringify(eventsObject));
    } catch (error) {
      console.error('Failed to save events:', error);
      throw new Error('Failed to save events to storage');
    }
  }

  /**
   * Clean up resources when the service is no longer needed
   */
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Export singleton instance
export const deletedEventStorage = DeletedEventStorage.getInstance();

