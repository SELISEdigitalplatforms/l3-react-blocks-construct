import type { ActivityItem } from '../../services/activity-log.types';

interface ActivityLogItemProps extends ActivityItem {
  isEven: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

const ActivityLogItem = ({ time, category, description, isEven }: ActivityLogItemProps) => (
  <div className="relative flex items-start mb-4 last:mb-0">
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
