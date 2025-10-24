import { MEMBER_STATUS } from '../enums/calendar.enum';

export interface EventMember {
  userId: string;
  status: MEMBER_STATUS;
  name: string;
  email: string;
}

export interface EventResource {
  id?: string;
  description?: string;
  meetingLink?: string;
  members?: EventMember[];
  recurring?: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
  recurrence?: {
    frequency: string;
    interval: number;
    byDay?: string[];
    count?: number;
    until?: Date;
  };
}

