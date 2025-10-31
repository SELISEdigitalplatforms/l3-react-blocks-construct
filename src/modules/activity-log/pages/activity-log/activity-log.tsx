import { ActivityLogTimeline } from '../../activity-log-v1/components/activity-log-timeline/activity-log-timeline';
import { activitiesData } from '../../activity-log-v1/services/activity-log-v1-services';
import ActivityLogToolbar from '../../components/activity-log-toobar/activity-log-toolbar';
import { useActivityLogFilters } from '../../hooks/use-activity-log-filters';

/**
 * ActivityLogPage Component
 *
 * Displays a timeline of filtered user activities using a shared filtering hook.
 *
 */
export const ActivityLogPage = () => {
  const {
    setSearchQuery,
    setDateRange,
    selectedCategory,
    setSelectedCategory,
    filteredActivities,
  } = useActivityLogFilters(activitiesData);

  return (
    <div className="flex w-full flex-col">
      <ActivityLogToolbar
        onSearchChange={setSearchQuery}
        onDateRangeChange={setDateRange}
        onCategoryChange={setSelectedCategory}
        selectedCategory={selectedCategory}
        title="ACTIVITY_LOG"
      />
      <ActivityLogTimeline activities={filteredActivities} />
    </div>
  );
};

export const ActivityLog = ActivityLogPage;
