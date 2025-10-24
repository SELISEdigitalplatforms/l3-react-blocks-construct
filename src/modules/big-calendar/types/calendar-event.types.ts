import { Event } from 'react-big-calendar';
import { MEMBER_STATUS } from '../enums/calendar.enum';
import { EventContentTextColor } from '../constants/calendar.constants';

export interface Member {
  id: string;
  name: string;
  image: string;
  status?: MEMBER_STATUS;
}
export interface RecurrencePattern {
  selectedDays: string[];
  period: string;
  interval: number;
  endType: 'never' | 'on' | 'after';
  onDate?: string;
  occurrenceCount?: number;
}

export interface CalendarEvent extends Event {
  eventId?: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  events?: CalendarEvent[];
  resource?: {
    meetingLink?: string;
    description?: string;
    color?: string;
    members?: Member[];
    recurring?: boolean;
    patternChanged?: boolean;
    invitationAccepted?: boolean;
    recurrencePattern?: RecurrencePattern;
  };
}

export type EventContentTextColor =
  (typeof EventContentTextColor)[keyof typeof EventContentTextColor];

export type DeleteUpdateEventOption = 'this' | 'thisAndFollowing' | 'all';

export interface DeleteUpdateRecurringEventOption {
  value: DeleteUpdateEventOption;
  labelKey: string;
}
