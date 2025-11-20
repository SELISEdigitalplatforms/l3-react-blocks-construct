import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRange } from 'react-day-picker';
import { Check, PlusCircle, Search } from 'lucide-react';
import { debounce } from 'lodash';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-kit/button';
import { Input } from '@/components/ui-kit/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui-kit/popover';
import { Calendar } from '@/components/ui-kit/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui-kit/command';
import { availableModulesData } from '@/modules/activity-log/activity-log-v1/services/activity-log-v1-services';

/**
 * ActivityLogToolbar Component
 *
 * A reusable toolbar component for filtering and searching activity logs.
 * This component supports:
 * - Searching activities by description
 * - Filtering activities by date range
 * - Filtering activities by module categories
 *
 * Features:
 * - Debounced search input for optimized performance
 * - Date range picker with clear filter functionality
 * - Module selector with multi-select and clear all options
 *
 * Props:
 * @param {(query: string) => void} [onSearchChange] - Callback triggered when the search query changes
 * @param {(dateRange: DateRange | undefined) => void} [onDateRangeChange] - Callback triggered when the date range changes
 * @param {(categories: string[]) => void} onCategoryChange - Callback triggered when the selected categories change
 * @param {string[]} selectedCategory - The currently selected module categories
 *
 * @example
 * // Basic usage
 * <ActivityLogToolbar
 *   onSearchChange={(query) => console.log('Search query:', query)}
 *   onDateRangeChange={(range) => console.log('Date range:', range)}
 *   onCategoryChange={(categories) => console.log('Selected categories:', categories)}
 *   selectedCategory={['task_manager', 'calendar']}
 * />
 */

interface ActivityLogToolbarProps {
  onSearchChange?: (query: string) => void;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
  onCategoryChange: (categories: string[]) => void;
  selectedCategory: string[];
  title?: string;
}

export const ActivityLogToolbar = ({
  onSearchChange,
  onDateRangeChange,
  onCategoryChange,
  selectedCategory,
  title,
}: Readonly<ActivityLogToolbarProps>) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const debouncedSearch = debounce((value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(searchValue);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchValue, debouncedSearch]);

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
    if (onDateRangeChange) {
      onDateRangeChange(newDateRange);
    }
  };

  const clearDateRange = () => {
    setDateRange(undefined);
    setIsPopoverOpen(false);
    if (onDateRangeChange) {
      onDateRangeChange(undefined);
    }
  };

  const handleModuleSelect = (moduleId: string) => {
    const newSelectedCategories = selectedCategory.includes(moduleId)
      ? selectedCategory.filter((id) => id !== moduleId)
      : [...selectedCategory, moduleId];
    onCategoryChange(newSelectedCategories);
  };

  const handleClearModules = () => {
    onCategoryChange([]);
  };

  return (
    <div className="mb-[18px] flex flex-col sm:flex-row sm:items-center sm:justify-between md:mb-[32px]">
      <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">
        {t(title ?? 'ACTIVITY_LOG')}
      </h3>
      <div className="flex flex-col gap-2 mt-2 sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative  w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 bg-background" />
          <Input
            placeholder={t('SEARCH_BY_DESCRIPTION')}
            className="h-8 w-full rounded-lg bg-background pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed hidden sm:inline-flex">
              <PlusCircle />
              {t('DATE')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto">
            <div className="max-h-[80vh] overflow-y-auto">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={1}
                className="rounded-md border"
                defaultMonth={dateRange?.from || new Date()}
              />
              <div className="p-2 border-t">
                <Button variant="ghost" onClick={clearDateRange} className="w-full" size="sm">
                  {t('CLEAR_FILTER')}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed hidden sm:inline-flex">
              <PlusCircle />
              {t('MODULE')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="sm:max-w-[200px] p-0">
            <Command>
              <CommandInput placeholder={t('ENTER_MODULE_NAME')} />
              <CommandList>
                <CommandEmpty>{t('NO_MODULES_FOUND')}</CommandEmpty>
                <CommandGroup>
                  {availableModulesData.map((module) => {
                    const isSelected = selectedCategory.includes(module.id);
                    return (
                      <CommandItem
                        key={module.id}
                        onSelect={() => handleModuleSelect(module.id)}
                        className="flex items-center"
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-md border border-primary',
                            isSelected ? 'bg-primary text-white' : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        <span>{t(module.label)}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {selectedCategory.length > 0 && (
                  <div className="border-t p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearModules}
                      className="w-full justify-center text-center"
                    >
                      {t('CLEAR_ALL')}
                    </Button>
                  </div>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ActivityLogToolbar;
