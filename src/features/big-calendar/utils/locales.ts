import { dateFnsLocalizer } from 'react-big-calendar';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import enGB from 'date-fns/locale/en-GB';

const locales = {
  'en-US': enUS,
  'en-GB': enGB,
};

export const calendarLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const calendarTimeFormat = {
  timeGutterFormat: 'HH:mm',
};
