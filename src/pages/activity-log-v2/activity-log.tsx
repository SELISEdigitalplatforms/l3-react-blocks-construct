import { ActivityLogToolbar } from 'features/activity-log-v1/components/activity-log-toobar/activity-log-toolbar';
import ActivityLogTimeline from 'features/activity-log-v2/components/activity-log-timeline/activity-log-timeline';
import { activities } from 'features/activity-log-v2/components/activity-log-timeline/activity-data';
import { useActivityLogFilters } from 'features/activity-log-v1/hooks/use-activity-log-filters';
import { useTranslation } from 'react-i18next';

/**
 * ActivityLogPage2 Component
 *
 * Displays a timeline of filtered user activities using a shared filtering hook.
 *
 * @returns {JSX.Element}
 */
export default function ActivityLogPage2() {
  const { t } = useTranslation();
  const {
    setSearchQuery,
    setDateRange,
    selectedCategory,
    setSelectedCategory,
    filteredActivities,
  } = useActivityLogFilters(activities);

  return (
    <div className="flex w-full flex-col">
      <div className="mb-[18px] flex flex-col sm:flex-row sm:items-center sm:justify-between md:mb-[32px]">
        <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">{t('TIMELINE')}</h3>
        <ActivityLogToolbar
          onSearchChange={setSearchQuery}
          onDateRangeChange={setDateRange}
          onCategoryChange={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      </div>
      <ActivityLogTimeline activities={filteredActivities} />
    </div>
  );
}
