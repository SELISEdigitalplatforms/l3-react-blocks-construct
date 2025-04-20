import { Separator } from 'components/ui/separator';
import { ActivityGroup } from '../../services/activity-log.types';
import ActivityLogItem from './activity-log-item';

const getFormattedDateLabel = (date: string) => {
  const activityDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const normalizedYesterday = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate()
  );
  const normalizedActivityDate = new Date(
    activityDate.getFullYear(),
    activityDate.getMonth(),
    activityDate.getDate()
  );

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  if (normalizedActivityDate.getTime() === normalizedToday.getTime()) {
    return `TODAY - ${formattedDate}`;
  } else if (normalizedActivityDate.getTime() === normalizedYesterday.getTime()) {
    return `YESTERDAY - ${formattedDate}`;
  } else {
    const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const weekdayName = weekdays[activityDate.getDay()];
    return `${weekdayName} - ${formattedDate}`;
  }
};

const ActivityLogGroup = ({
  date,
  items,
  isLastIndex,
}: ActivityGroup & { isLastIndex: boolean }) => (
  <div className="mb-6 relative">
    <div className="text-low-emphasis font-medium text-xs mb-2 pb-1">
      {getFormattedDateLabel(date)}
    </div>
    <div className="relative">
      {items.map((activity, index) => (
        <ActivityLogItem key={index} {...activity} />
      ))}
    </div>
    {!isLastIndex && <Separator />}
  </div>
);

export default ActivityLogGroup;
