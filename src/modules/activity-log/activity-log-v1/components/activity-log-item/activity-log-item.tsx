import { ActivityItem } from '../../types/activity-log.types';

/**
 * ActivityLogItem Component
 *
 * A reusable component for rendering a single activity log item.
 * This component supports:
 * - Displaying the activity time in a human-readable format
 * - Categorizing activities with a visual badge
 * - Showing a description of the activity
 *
 * Features:
 * - Displays a timestamp for the activity
 * - Includes a category badge for quick identification
 * - Provides a description of the activity
 * - Styled with a timeline indicator for visual grouping
 *
 * Props:
 * @param {string} time - The timestamp of the activity
 * @param {string} category - The category of the activity
 * @param {string} description - The description of the activity
 *
 * @example
 * // Basic usage
 * <ActivityLogItem
 *   time="2025-05-04T10:30:00Z"
 *   category="Work"
 *   description="Task completed successfully."
 * />
 */

export const ActivityLogItem = ({ time, category, description }: Readonly<ActivityItem>) => (
  <div className="flex mb-4 relative">
    <div className="absolute left-1.5 -ml-8 top-1.5 z-10">
      <div className="h-4 w-4 bg-blue-400 rounded-full" />
    </div>
    <div className="flex-1">
      <div className="flex items-center">
        <div className="text-xs font-normal text-medium-emphasis mr-2">
          {new Date(time).toLocaleString()}
        </div>
        <div className="h-2 w-2 bg-gray-300 mr-2 rounded-full" />
        <div className="px-2 py-0.5 text-high-emphasis font-semibold text-sm bg-surface rounded">
          {category}
        </div>
      </div>
      <div className="text-base text-high-emphasis text-gray-800 mt-1">{description}</div>
    </div>
  </div>
);
