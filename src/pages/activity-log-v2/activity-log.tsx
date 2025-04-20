import { ActivityLogToolbar } from 'features/activity-log-v2/components/activity-log-toobar/activity-log-toolbar';
import { activities } from 'features/activity-log-v2/components/activity-log-timeline/activity-data';
import ActivityLogTimeline from 'features/activity-log-v2/components/activity-log-timeline/activity-log-timeline';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export default function ActivityLogPage2() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filteredActivities, setFilteredActivities] = useState(activities);

  const filterActivities = (query: string, range: DateRange | undefined) => {
    let filtered = activities;

    if (range?.from && range?.to) {
      const fromDate = range.from.getTime();
      const toDate = range.to.getTime();

      filtered = filtered.filter((activity) => {
        const activityDate = new Date(activity.date).getTime();
        return activityDate >= fromDate && activityDate <= toDate;
      });
    }

    if (query) {
      filtered = filtered
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            item.description.toLowerCase().includes(query.toLowerCase())
          ),
        }))
        .filter((group) => group.items.length > 0);
    }

    setFilteredActivities(filtered);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    filterActivities(query, dateRange);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    filterActivities(searchQuery, range);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-[18px] flex items-center justify-between md:mb-[32px]">
        <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">Activity Log</h3>
        <ActivityLogToolbar
          onSearchChange={handleSearchChange}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>
      <ActivityLogTimeline activities={filteredActivities} />
    </div>
  );
}
