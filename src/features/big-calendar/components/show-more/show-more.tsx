import { CalendarEvent } from '../../types/calendar-event.types';
import { ShowMorePopup } from '../show-more-popup/show-more-popup';

interface ShowMoreProps {
  count: number;
  remainingEvents: CalendarEvent[];
}

export const ShowMore = ({ count, remainingEvents }: Readonly<ShowMoreProps>) => {
  return <ShowMorePopup count={count} remainingEvents={remainingEvents} />;
};
