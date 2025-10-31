import { DateRange } from 'react-day-picker';

export const normalizeDate = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

export const createDateRangeFilter = (
  getDate: (row: any) => Date | null | undefined
) => {
  return (row: any, id: string, value: DateRange) => {
    if (!value) return true;

    const rowDate = getDate(row);
    if (!rowDate) return false;

    const normalizedRowDate = normalizeDate(rowDate);

    if (value.from && !value.to) {
      const normalizedFrom = normalizeDate(value.from);
      return normalizedRowDate >= normalizedFrom;
    }

    if (!value.from && value.to) {
      const normalizedTo = normalizeDate(value.to);
      return normalizedRowDate <= normalizedTo;
    }

    if (value.from && value.to) {
      const normalizedFrom = normalizeDate(value.from);
      const normalizedTo = normalizeDate(value.to);
      return normalizedRowDate >= normalizedFrom && normalizedRowDate <= normalizedTo;
    }

    return true;
  };
};
