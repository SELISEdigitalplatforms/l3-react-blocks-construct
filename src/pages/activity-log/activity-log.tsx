import {
  activitiesData,
  ActivityLogTimeline,
  ActivityLogToolbar,
  useActivityLogFilters,
} from '@/features/activity-log-v1';

/**
 * ActivityLogPage1 Component
 *
 * Displays a timeline of filtered user activities using a shared filtering hook.
 *
 */
export const ActivityLog = () => {
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
