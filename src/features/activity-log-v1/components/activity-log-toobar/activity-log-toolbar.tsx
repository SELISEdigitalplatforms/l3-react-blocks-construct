import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Check, PlusCircle, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { Calendar } from 'components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'components/ui/command';
import { cn } from 'lib/utils';

interface ActivityLogToolbarProps {
  onSearchChange?: (query: string) => void;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

type Module = {
  id: string;
  label: string;
};

const availableModules: Module[] = [
  { id: '1', label: 'Task Manager' },
  { id: '2', label: 'Calender' },
  { id: '3', label: 'Email' },
  { id: '4', label: 'IAM' },
  { id: '5', label: 'Inventory' },
  { id: '6', label: 'Dashboard' },
];

export function ActivityLogToolbar({ onSearchChange, onDateRangeChange }: ActivityLogToolbarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());

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
    setSelectedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }

      return newSet;
    });
  };

  const handleClearModules = () => {
    setSelectedModules(new Set());

  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 bg-background" />
        <Input
          placeholder="Search by description..."
          className="h-8 w-full rounded-lg bg-background pl-8"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <PlusCircle />
            Date
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateRangeChange}
            numberOfMonths={2}
            className="rounded-md border"
            defaultMonth={dateRange?.from || new Date()}
          />
          <div className="p-2 border-t">
            <Button variant="ghost" onClick={clearDateRange} className="w-full" size="sm">
              Clear filter
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <PlusCircle />
            Module
          </Button>
        </PopoverTrigger>
        <PopoverContent className="sm:max-w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Enter module name" />
            <CommandList>
              <CommandEmpty>No modules found.</CommandEmpty>
              <CommandGroup>
                {availableModules.map((module) => {
                  const isSelected = selectedModules.has(module.id);
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
                      <span>{module.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedModules.size > 0 && (
                <div className="border-t p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearModules}
                    className="w-full justify-center text-center"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ActivityLogToolbar;