export enum CalendarEventColor {
  PRIMARY = 'hsl(var(--primary-500))',
  SECONDARY = 'hsl(var(--secondary-500))',
  DEEPPURPLE = 'hsl(var(--purple-500))',
  BURGUNDY = 'hsl(var(--burgundy-500))',
  WARNING = 'hsl(var(--warning))',
  PRIMARY100 = 'hsl(var(--primary-100))',
  SECONDARY100 = 'hsl(var(--secondary-100))',
  DEEPPURPLE100 = 'hsl(var(--purple-100))',
  BURGUNDY100 = 'hsl(var(--burgundy-100))',
}

export enum MEMBER_STATUS {
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  NORESPONSE = 'no response',
}

export enum CalendarModalState {
  NONE,
  EVENT_DETAIL,
  EDIT_EVENT,
  EVENT_RECURRENCE,
}

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

export type EventContentTextColor = typeof EventContentTextColor[keyof typeof EventContentTextColor];
