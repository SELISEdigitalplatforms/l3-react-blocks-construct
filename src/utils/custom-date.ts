/**
 * Pads a number with leading zeros to ensure it's at least 2 digits long.
 * @param num The number to pad
 * @returns A string of the padded number
 */
const pad = (num: number): string => num.toString().padStart(2, '0');

/**
 * Formats a Date object into a string in the format "DD/MM/YYYY, HH:mm".
 * @param date The Date object to format
 * @returns A formatted date string
 */
export const formatDate = (date: Date, withoutTime?: boolean): string => {
  const dateStr = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  if (withoutTime) return `${dateStr}`;
  return `${dateStr}, ${timeStr}`;
};
