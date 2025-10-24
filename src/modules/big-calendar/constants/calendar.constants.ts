import { DeleteUpdateRecurringEventOption } from '../types/calendar-event.types';

export const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WEEK_DAYS_RRULE = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

export const CALENDER_PERIOD = ['DAY', 'WEEK', 'MONTH', 'YEAR'];

export const ZOOM_MEETING_LINK = 'https:zoommtg://zoom.us/join?confno=&uname=test%link';

export const WEEK_DAYS_SELECT = [
  { value: '1', label: 'MONDAY' },
  { value: '2', label: 'TUESDAY' },
  { value: '3', label: 'WEDNESDAY' },
  { value: '4', label: 'THURSDAY' },
  { value: '5', label: 'FRIDAY' },
  { value: '6', label: 'SATURDAY' },
  { value: '0', label: 'SUNDAY' },
];

export const TIME_SCALES_SELECT = [
  { value: '15', label: '15 mins' },
  { value: '30', label: '30 mins' },
  { value: '60', label: '60 mins' },
];

export const EVENT_DURATIONS_SELECT = [
  { value: '15', label: '15 mins' },
  { value: '30', label: '30 mins' },
  { value: '45', label: '45 mins' },
  { value: '60', label: '60 mins' },
];

export const EventContentTextColor = {
  PRIMARY: 'hsl(var(--white))' as const,
  SECONDARY: 'hsl(var(--high-emphasis))' as const,
  DEEPPURPLE: 'hsl(var(--white))' as const,
  BURGUNDY: 'hsl(var(--white))' as const,
  WARNING: 'hsl(var(--high-emphasis))' as const,
  PRIMARY100: 'hsl(var(--high-emphasis))' as const,
  SECONDARY100: 'hsl(var(--high-emphasis))' as const,
  DEEPPURPLE100: 'hsl(var(--high-emphasis))' as const,
  BURGUNDY100: 'hsl(var(--high-emphasis))' as const,
} as const;

export const DELETE_UPDATE_RECURRING_EVENT_OPTIONS: DeleteUpdateRecurringEventOption[] = [
  { value: 'this', labelKey: 'THIS_EVENT_ONLY' },
  { value: 'thisAndFollowing', labelKey: 'THIS_AND_FOLLOWING_EVENTS' },
  { value: 'all', labelKey: 'ALL_EVENTS_SERIES' },
];
