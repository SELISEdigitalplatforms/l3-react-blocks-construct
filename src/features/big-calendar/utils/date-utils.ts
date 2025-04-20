import { addMinutes, format, startOfDay } from 'date-fns';
import { CalendarEventColor, EventContentTextColor } from '../enums/calendar.enum';

/**
 * Generate a time range array with given minute interval.
 * @param intervalMinutes minutes between each time slot
 */
export function generateTimePickerRange(intervalMinutes: number): string[] {
  const slots = Math.ceil((24 * 60) / intervalMinutes);
  return Array.from({ length: slots }, (_, i) => {
    const time = addMinutes(startOfDay(new Date()), i * intervalMinutes);
    return format(time, 'HH:mm');
  });
}

export const timePickerRange = generateTimePickerRange(30);

export const getTextColorClassFromBg = (bgColor?: string): string => {
  if (!bgColor) return 'hsl(var(--high-emphasis))';

  const matchedKey = Object.entries(CalendarEventColor).find(
    ([, value]) => value === bgColor
  )?.[0] as keyof typeof EventContentTextColor | undefined;

  return matchedKey ? EventContentTextColor[matchedKey] : 'hsl(var(--high-emphasis))';
};
