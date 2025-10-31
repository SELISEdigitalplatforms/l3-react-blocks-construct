import { Separator } from '@/components/ui-kit/separator';
import { ActivityGroup } from '../../types/activity-log.types';
import { ActivityLogItem } from '../activity-log-item/activity-log-item';
import { getFormattedDateLabel } from '../../utils/activity-log-utils';

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
 * @example
 * // Basic usage
 * <ActivityLogGroup
 *   date="2025-05-04"
 *   items={[{ id: 1, description: 'Task completed', category: 'Work' }]}
 *   isLastIndex={false}
 * />
 */

export const ActivityLogGroup = ({
  date,
  items,
  isLastIndex,
}: Readonly<ActivityGroup & { isLastIndex: boolean }>) => (
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
