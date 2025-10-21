import { addMinutes, format, startOfDay } from 'date-fns';
import { CalendarEventColor } from '../enums/calendar.enum';
import { EventContentTextColor } from '../constants/calendar.constants';

/**
 * Generates an array of time strings at regular intervals throughout a 24-hour day.
 *
 * This utility function creates a collection of formatted time strings (HH:mm) at specified
 * minute intervals starting from midnight (00:00) and continuing through a full 24-hour period.
 * Useful for creating time selection options in time pickers, scheduling interfaces, or
 * any UI component that requires time slot selection.
 *
 * @param intervalMinutes - The interval in minutes between each time slot (e.g., 15, 30, 60)
 * @returns An array of formatted time strings in 24-hour format (HH:mm)
 * @example
 * // Returns ['00:00', '00:30', '01:00', ... '23:30'] for 30-minute intervals
 * generateTimePickerRange(30)
 *
 * // Returns ['00:00', '00:15', '00:30', ... '23:45'] for 15-minute intervals
 * generateTimePickerRange(15)
 */
export function generateTimePickerRange(intervalMinutes: number): string[] {
  const slots = Math.ceil((24 * 60) / intervalMinutes);
  return Array.from({ length: slots }, (_, i) => {
    const time = addMinutes(startOfDay(new Date()), i * intervalMinutes);
    return format(time, 'HH:mm');
  });
}

/**
 * Determines the appropriate text color class based on a background color.
 *
 * This utility function takes a background color (typically from a calendar event)
 * and returns the appropriate text color class to ensure optimal readability.
 * It maps background colors from CalendarEventColor enum to their corresponding
 * text colors defined in EventContentTextColor enum.
 *
 * @param bgColor - The background color value (usually an HSL string like 'hsl(var(--primary-500))')
 * @returns A string representing the CSS color value for text that will be readable on the given background
 * @example
 * // Returns 'hsl(var(--white))' for a dark background
 * getTextColorClassFromBg('hsl(var(--primary-900))')
 *
 * // Returns 'hsl(var(--high-emphasis))' for a light background or undefined input
 * getTextColorClassFromBg('hsl(var(--primary-100))')
 */
export const getTextColorClassFromBg = (bgColor?: string): string => {
  if (!bgColor) return 'hsl(var(--high-emphasis))';

  const matchedKey = Object.entries(CalendarEventColor).find(
    ([, value]) => value === bgColor
  )?.[0] as keyof typeof EventContentTextColor | undefined;

  return matchedKey ? EventContentTextColor[matchedKey] : 'hsl(var(--high-emphasis))';
};
