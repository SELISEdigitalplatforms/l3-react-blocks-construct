import type { ActivityGroup } from '../../types/activity-log.types';
import { getFormattedDateLabel } from '../../utils/activity-log-utils';
import { ActivityLogItem } from '../activity-log-item/activity-log-item';

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
 * @example
 * <ActivityLogGroup
 *   date="2024-05-03"
 *   items={[{ time: '09:00', description: 'Logged in', ... }]}
 *   isLastIndex={false}
 *   isFirstIndex={false}
 * />
 */

interface ActivityLogGroupProps extends ActivityGroup {
  isLastIndex: boolean;
  isFirstIndex: boolean;
}

export const ActivityLogGroup = ({ date, items, isLastIndex }: Readonly<ActivityLogGroupProps>) => (
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
