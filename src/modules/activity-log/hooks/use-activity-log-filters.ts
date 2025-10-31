import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ActivityGroup } from '../activity-log-v1/types/activity-log.types';

const transformCategory = (category: string): string => category.toLowerCase().replace(/\s+/g, '_');

export function useActivityLogFilters(activities: ActivityGroup[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [filteredActivities, setFilteredActivities] = useState(activities);

  useEffect(() => {
    let filtered = activities;

    if (dateRange?.from && dateRange?.to) {
      const from = dateRange.from.getTime();
      const to = dateRange.to.getTime();
      filtered = filtered.filter((activity) => {
        const activityDate = new Date(activity.date).getTime();
        return activityDate >= from && activityDate <= to;
      });
    }

    if (searchQuery) {
      filtered = filtered
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((group) => group.items.length > 0);
    }

    if (selectedCategory.length > 0) {
      filtered = filtered
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            selectedCategory.includes(transformCategory(item.category))
          ),
        }))
        .filter((group) => group.items.length > 0);
    }

    setFilteredActivities(filtered);
  }, [searchQuery, dateRange, selectedCategory, activities]);

  return {
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    selectedCategory,
    setSelectedCategory,
    filteredActivities,
  };
}
