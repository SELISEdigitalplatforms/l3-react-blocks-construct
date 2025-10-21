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
