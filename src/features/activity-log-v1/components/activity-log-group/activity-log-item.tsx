import { ActivityItem } from '../../services/activity-log.types';

const ActivityLogItem = ({ time, category, description }: ActivityItem) => (
  <div className="flex mb-4 relative">
    <div className="absolute left-1.5 -ml-8 top-1.5 z-10">
      <div className="h-4 w-4 bg-blue-400 rounded-full"></div>
    </div>
    <div className="flex-1">
      <div className="flex items-center">
        <div className="text-xs font-normal text-medium-emphasis mr-2">
        {new Date(time).toLocaleString()}
        </div>
        <div className="h-2 w-2 bg-gray-300 mr-2 rounded-full"></div>
        <div className="px-2 py-0.5 text-high-emphasis font-semibold text-sm bg-surface rounded">
          {category}
        </div>
      </div>
      <div className="text-base text-high-emphasis text-gray-800 mt-1">{description}</div>
    </div>
  </div>
);

export default ActivityLogItem;