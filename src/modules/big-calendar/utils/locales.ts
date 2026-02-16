import { useMemo } from 'react';
import enUS from 'date-fns/locale/en-US';
import enGB from 'date-fns/locale/en-GB';
import { dateFnsLocalizer } from 'react-big-calendar';
import { format, getDay, parse, startOfWeek } from 'date-fns';

export const calendarTimeFormat = {
  timeGutterFormat: 'HH:mm',
};

const localesMap = {
  'en-US': enUS,
  'en-GB': enGB,
};

export function useCustomLocalizer(settings: { firstDayOfWeek: number }) {
  return useMemo(
    () =>
      dateFnsLocalizer({
        format,
        parse,
        startOfWeek: (date: Date) =>
          startOfWeek(date, { weekStartsOn: settings.firstDayOfWeek as import('date-fns').Day }),
        getDay,
        locales: localesMap,
      }),
    [settings.firstDayOfWeek]
  );
}
