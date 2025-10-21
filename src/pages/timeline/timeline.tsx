import { ActivityLogToolbar, useActivityLogFilters } from '@/features/activity-log-v1';
import { activitiesData, ActivityLogTimeline } from '@/features/activity-log-v2';

/**
 * Timeline Component
 *
 * Displays a timeline of filtered user activities using a shared filtering hook.
 */
export function Timeline() {
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
        title="TIMELINE"
      />
      <ActivityLogTimeline activities={filteredActivities} />
    </div>
  );
}
