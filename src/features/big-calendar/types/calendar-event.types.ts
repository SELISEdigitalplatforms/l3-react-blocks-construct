import { Event } from 'react-big-calendar';
import { MEMBER_STATUS } from '../enums/calendar.enum';

export interface Member {
  id: string;
  name: string;
  image: string;
  status?: MEMBER_STATUS;
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
  };
}
