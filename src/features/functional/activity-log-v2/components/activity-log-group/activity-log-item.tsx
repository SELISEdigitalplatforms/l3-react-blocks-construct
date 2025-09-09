import type { ActivityItem } from '../../services/activity-log.types';

/**
 * ActivityLogItem Component
 *
 * A visual representation of a single activity entry in the timeline.
 * Items are visually split between the left and right sides depending on their index,
 * creating an alternating zig-zag timeline layout.
 *
 * Features:
 * - Alternating layout based on even/odd index
 * - Displays time, category, and description
 * - Central timeline indicator dot
 * - Responsive styling for different screen sizes
 *
 * Props:
 * @param {string} time - The timestamp of the activity (ISO string recommended)
 * @param {string} category - The category name associated with the activity
 * @param {string} description - The activity description or details
 * @param {boolean} isEven - Indicates if the item index is even (used to alternate layout side)
 * @param {boolean} [isFirst] - *(Optional)* Indicates if this item is the first in the group
 * @param {boolean} [isLast] - *(Optional)* Indicates if this item is the last in the group
 *
 * @returns {JSX.Element} A single styled activity entry in the timeline
 *
 * @example
 * <ActivityLogItem
 *   time="2024-05-03T09:15:00Z"
 *   category="Login"
 *   description="User logged in from web app"
 *   isEven={true}
 * />
 */

interface ActivityLogItemProps extends ActivityItem {
  isEven: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

const ActivityLogItem = ({ time, category, description, isEven, isFirst, isLast }: ActivityLogItemProps) => (
  <div className={`relative flex items-start mb-4 ${isLast ? 'mb-0' : ''} ${isFirst ? 'mt-0' : ''}`}>
    <div className="w-1/2 pr-4 flex justify-end">
      {!isEven && (
        <div className="text-right max-w-[90%]">
          <div className="flex flex-col lg:flex-row items-end lg:items-center justify-end text-xs mb-2">
            <span className="text-medium-emphasis">{new Date(time).toLocaleString()}</span>
            <span className="hidden lg:inline mx-2 h-2 w-2 rounded-full bg-neutral-200" />
            <span className="text-high-emphasis font-semibold">{category}</span>
          </div>
          <div className="text-base text-high-emphasis">{description}</div>
        </div>
      )}
    </div>

    <div className="absolute left-1/2 transform -translate-x-1/2 mt-1.5 z-10">
      <div className="w-4 h-4 bg-secondary rounded-full" />
    </div>

    <div className="w-1/2 pl-4">
      {isEven && (
        <div className="max-w-[90%]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center text-xs mb-2">
            <span className="text-medium-emphasis">{new Date(time).toLocaleString()}</span>
            <span className="hidden lg:inline mx-2 h-2 w-2 rounded-full bg-neutral-200" />
            <span className="text-high-emphasis font-semibold">{category}</span>
          </div>
          <div className="text-base text-high-emphasis">{description}</div>
        </div>
      )}
    </div>
  </div>
);

export default ActivityLogItem;
