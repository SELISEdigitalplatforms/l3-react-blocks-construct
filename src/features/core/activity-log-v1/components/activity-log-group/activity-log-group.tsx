import { Separator } from 'components/ui/separator';
import { ActivityGroup } from '../../services/activity-log.types';
import ActivityLogItem from './activity-log-item';

/**
 * ActivityLogGroup Component
 *
 * A reusable component for rendering a group of activity log items.
 * This component supports:
 * - Displaying a formatted date label for the group
 * - Rendering a list of activity log items
 * - Adding a separator between groups
 *
 * Features:
 * - Dynamically formats the date label based on the activity date
 * - Displays a list of activities for the given date
 * - Adds a separator between groups unless it is the last group
 *
 * Props:
 * @param {string} date - The date of the activity group
 * @param {Array} items - The list of activity log items for the group
 * @param {boolean} isLastIndex - Whether this is the last group in the list
 *
 * @returns {JSX.Element} The activity log group component
 *
 * @example
 * // Basic usage
 * <ActivityLogGroup
 *   date="2025-05-04"
 *   items={[{ id: 1, description: 'Task completed', category: 'Work' }]}
 *   isLastIndex={false}
 * />
 */

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
        <ActivityLogItem key={`${activity.time}-${index}`} {...activity} />
      ))}
    </div>
    {!isLastIndex && <Separator />}
  </div>
);

export default ActivityLogGroup;
