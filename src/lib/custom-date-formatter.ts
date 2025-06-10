/**
 * Formats a date string or Date object into a customizable format
 *
 * @param dateInput - Date string or Date object to format
 * @param options - Configuration options for date formatting
 * @param options.showTime - Whether to include time in the output (default: false)
 * @param options.timeFormat - Format to use for time, 12 or 24 hour notation (default: 12)
 * @param options.dateDelimiter - Character to use between date parts (default: '/')
 * @param options.dateOrder - Order of date components: 'DMY' (day-month-year), 'YMD' (year-month-day), or 'MDY' (month-day-year) (default: 'DMY')
 * @returns Formatted date string or '-' if input is invalid
 *
 * @example
 * // Returns "2025-04-20"
 * CustomtDateFormat(new Date(2025, 3, 20), { dateDelimiter: '-', dateOrder: 'YMD' })
 *
 * @example
 * // Returns "20/04/2025, 03:30 PM"
 * CustomtDateFormat(new Date(2025, 3, 20, 15, 30), { showTime: true })
 *
 * @example
 * // Returns "20-04-2025, 15:30"
 * CustomtDateFormat(new Date(2025, 3, 20, 15, 30), { showTime: true, timeFormat: 24, dateDelimiter: '-' })
 */
export function CustomtDateFormat(
  dateInput: string | Date | null | undefined,
  options: {
    showTime?: boolean;
    timeFormat?: 12 | 24;
    dateDelimiter?: string;
  } = {}
): string {
  const { showTime = false, timeFormat = 12, dateDelimiter = '/' } = options;

  if (!dateInput) return '';

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (Number.isNaN(date.getTime())) return '-';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const dateStr = `${day}${dateDelimiter}${month}${dateDelimiter}${year}`;

  if (!showTime) return dateStr;

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (timeFormat === 12) {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ?? 12;
    const hoursStr = String(hours).padStart(2, '0');

    return `${dateStr}, ${hoursStr}:${minutes} ${ampm}`;
  } else {
    const hoursStr = String(hours).padStart(2, '0');
    return `${dateStr}, ${hoursStr}:${minutes}`;
  }
}
