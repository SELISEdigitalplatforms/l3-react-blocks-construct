import type { ActivityGroup } from '../../services/activity-log.types';
import ActivityLogItem from './activity-log-item';


/**
 * ActivityLogGroup Component
 *
 * Displays a group of activity log items grouped by date, with a formatted label
 * and styled items. It handles visual spacing and indexing to determine styling
 * for first/last items within the timeline group.
 *
 * Features:
 * - Automatic date label formatting (e.g., "TODAY", "YESTERDAY", weekday)
 * - Renders multiple `ActivityLogItem` components within a single date group
 * - Indicates whether the item is the first or last in the full timeline
 *
 * Props:
 * @param {string} date - The date for this group of activities
 * @param {Array} items - List of activity items associated with this date
 * @param {boolean} isLastIndex - Whether this is the final group in the timeline
 * @param {boolean} isFirstIndex - (Unused) Reserved for potential future logic
 *
 * @returns {JSX.Element} A section of the activity timeline grouped by date
 *
 * @example
 * <ActivityLogGroup
 *   date="2024-05-03"
 *   items={[{ time: '09:00', description: 'Logged in', ... }]}
 *   isLastIndex={false}
 *   isFirstIndex={false}
 * />
 */

const getFormattedDateLabel = (date: string) => {
  const activityDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  activityDate.setHours(0, 0, 0, 0);

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  if (activityDate.getTime() === today.getTime()) {
    return `TODAY - ${formattedDate}`;
  } else if (activityDate.getTime() === yesterday.getTime()) {
    return `YESTERDAY - ${formattedDate}`;
  } else {
    const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const weekdayName = weekdays[activityDate.getDay()];
    return `${weekdayName} - ${formattedDate}`;
  }
};

interface ActivityLogGroupProps extends ActivityGroup {
  isLastIndex: boolean;
  isFirstIndex: boolean;
}

const ActivityLogGroup = ({ date, items, isLastIndex }: ActivityLogGroupProps) => (
  <div className="mb-8 relative">
    <div className="flex justify-center mb-4 relative z-10">
      <div className="bg-secondary-50 text-secondary-800 text-xs font-medium py-1 px-2 rounded">
        {getFormattedDateLabel(date)}
      </div>
    </div>

    <div className="relative">
      {items.map((activity, index) => (
        <ActivityLogItem
          key={`${activity.time}-${index}`}
          {...activity}
          isEven={index % 2 === 0}
          isFirst={index === 0}
          isLast={index === items.length - 1 && isLastIndex}
        />
      ))}
    </div>
  </div>
);

export default ActivityLogGroup;
