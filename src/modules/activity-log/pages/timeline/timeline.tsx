import { ActivityLogTimeline } from '../../activity-log-v2/components/activity-log-timeline/activity-log-timeline';
import { timelineActivitiesData } from '../../activity-log-v2/services/activity-log-v2-services';
import ActivityLogToolbar from '../../components/activity-log-toobar/activity-log-toolbar';
import { useActivityLogFilters } from '../../hooks/use-activity-log-filters';

/**
 * Timeline Component
 *
 * Displays a timeline of filtered user activities using a shared filtering hook.
 */
export function TimelinePage() {
  const {
    setSearchQuery,
    setDateRange,
    selectedCategory,
    setSelectedCategory,
    filteredActivities,
  } = useActivityLogFilters(timelineActivitiesData);

  return (
    <div className="flex w-full flex-col">
      <ActivityLogToolbar
        onSearchChange={setSearchQuery}
        onDateRangeChange={setDateRange}
        onCategoryChange={setSelectedCategory}
        selectedCategory={selectedCategory}
        title="TIMELINE"
      />
      <ActivityLogTimeline activities={filteredActivities} />
    </div>
  );
}
