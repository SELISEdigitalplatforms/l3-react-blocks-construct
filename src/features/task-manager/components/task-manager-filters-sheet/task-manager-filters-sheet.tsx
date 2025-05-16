import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from 'components/ui/sheet';
import { Button } from 'components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'components/ui/command';
import { Checkbox } from 'components/ui/checkbox';
import { useState } from 'react';
import { Label } from 'components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { PlusCircle } from 'lucide-react';
import { Calendar } from 'components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { useTaskContext } from '../../contexts/task-context';
import { Badge } from 'components/ui/badge';

/**
 * TaskManagerFilterSheet Component
 *
 * A reusable component for managing task filters in a task manager application.
 * This component allows users to:
 * - Filter tasks by due date, priority, status, assignees, and tags
 * - Apply or reset filters
 * - Dynamically update the task list based on selected filters
 *
 * Features:
 * - Provides a sheet-based UI for managing filters
 * - Supports filtering by multiple criteria (e.g., due date, priority, status)
 * - Allows users to clear all filters with a single button
 * - Displays selected filters as badges
 *
 * Props:
 * @param {boolean} open - Whether the filter sheet is open
 * @param {(open: boolean) => void} onOpenChange - Callback triggered when the sheet's open state changes
 *
 * @returns {JSX.Element} The task manager filter sheet component
 *
 * @example
 * // Basic usage
 * <TaskManagerFilterSheet
 *   open={isFilterSheetOpen}
 *   onOpenChange={(isOpen) => setFilterSheetOpen(isOpen)}
 * />
 */


// testing from own branch
interface TaskManagerFiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskManagerFilterSheet = ({
  open,
  onOpenChange,
}: Readonly<TaskManagerFiltersSheetProps>) => {
  const { assignees, tags, priorities, statuses, updateFilter, resetFilters } = useTaskContext();

  const [selectedDueDate, setSelectedDueDate] = useState<DateRange | null>(null);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const applyFilters = () => {
    updateFilter({
      dueDate: selectedDueDate
        ? {
            from: selectedDueDate.from || null,
            to: selectedDueDate.to || null,
          }
        : undefined,
      priorities: selectedPriorities,
      statuses: selectedStatuses,
      assignees: selectedAssignees,
      tags: selectedTags,
    });
    onOpenChange(false);
  };

  const resetAllFilters = () => {
    resetFilters();
    setSelectedDueDate(null);
    setSelectedPriorities([]);
    setSelectedStatuses([]);
    setSelectedAssignees([]);
    setSelectedTags([]);
    onOpenChange(false);
  };

  const renderPriorityItem = (priority: string) => {
    const isSelected = selectedPriorities.includes(priority);
    const togglePriority = () => {
      setSelectedPriorities((prev) =>
        isSelected ? prev.filter((p) => p !== priority) : [...prev, priority]
      );
    };

    return (
      <CommandItem key={priority} onSelect={togglePriority} className="flex items-center gap-2">
        <Checkbox checked={isSelected} />
        <span>{priority}</span>
      </CommandItem>
    );
  };

  const renderStatusItem = (status: string) => {
    const isSelected = selectedStatuses.includes(status);

    const toggleStatus = () => {
      setSelectedStatuses((prev) =>
        isSelected ? prev.filter((s) => s !== status) : [...prev, status]
      );
    };

    return (
      <CommandItem key={status} onSelect={toggleStatus} className="flex items-center gap-2">
        <Checkbox checked={isSelected} />
        <span>{status}</span>
      </CommandItem>
    );
  };

  const renderAssigneeItem = (assignee: { id: string; name: string }) => {
    const isSelected = selectedAssignees.includes(assignee.id);

    const toggleAssignee = () => {
      setSelectedAssignees((prev) =>
        isSelected ? prev.filter((a) => a !== assignee.id) : [...prev, assignee.id]
      );
    };

    return (
      <CommandItem key={assignee.id} onSelect={toggleAssignee} className="flex items-center gap-2">
        <Checkbox checked={isSelected} />
        <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-sm border-2 border-white">
          {assignee.name[0]}
        </div>
        <span>{assignee.name}</span>
      </CommandItem>
    );
  };

  const renderTagItem = (tag: { id: string; label: string }) => {
    const isSelected = selectedTags.includes(tag.id);

    const toggleTag = () => {
      setSelectedTags((prev) =>
        isSelected ? prev.filter((t) => t !== tag.id) : [...prev, tag.id]
      );
    };

    return (
      <CommandItem key={tag.id} onSelect={toggleTag} className="flex items-center gap-2">
        <Checkbox checked={isSelected} />
        <span>{tag.label}</span>
      </CommandItem>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent className="flex flex-col h-screen sm:h-[calc(100dvh-48px)] justify-between w-full sm:min-w-[450px] md:min-w-[450px] lg:min-w-[450px] sm:fixed sm:top-[57px]">
        <div className="flex-1 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="!text-left">Filters</SheetTitle>
            <SheetDescription />
          </SheetHeader>
          <div className="flex flex-col gap-6 mt-6">
            {/* Due Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed justify-start">
                  <PlusCircle />
                  Due Date
                  {selectedDueDate?.from && selectedDueDate?.to && (
                    <Badge className="ml-2 bg-surface">
                      {' '}
                      {selectedDueDate?.from.toLocaleDateString()} -{' '}
                      {selectedDueDate?.to.toLocaleDateString()}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={selectedDueDate ?? undefined}
                  numberOfMonths={2}
                  onSelect={(range) => setSelectedDueDate(range ?? null)}
                />
                <div className="p-2 border-t">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      resetAllFilters();
                    }}
                    className="w-full"
                    size="sm"
                  >
                    Clear filter
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Priority Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed justify-start">
                  <PlusCircle />
                  Priority
                </Button>
              </PopoverTrigger>
              <PopoverContent className="sm:max-w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search priorities" />
                  <CommandList>
                    <CommandEmpty>No priorities found.</CommandEmpty>
                    <CommandGroup>{priorities.map(renderPriorityItem)}</CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Status Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed justify-start">
                  <PlusCircle />
                  Status
                </Button>
              </PopoverTrigger>
              <PopoverContent className="sm:max-w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search statuses" />
                  <CommandList>
                    <CommandEmpty>No statuses found.</CommandEmpty>
                    <CommandGroup>{statuses.map(renderStatusItem)}</CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Assignee Filter */}
            <div>
              <Label>Assignee</Label>
              <div className="border rounded-lg max-h-52 overflow-y-auto">
                <Command>
                  <CommandInput placeholder="Search assignees" />
                  <CommandList>
                    <CommandEmpty>No assignees found.</CommandEmpty>
                    <CommandGroup>{assignees.map(renderAssigneeItem)}</CommandGroup>
                  </CommandList>
                </Command>
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <Label>Tags</Label>
              <div className="border rounded-lg max-h-44 overflow-y-auto">
                <Command>
                  <CommandInput placeholder="Search tags" />
                  <CommandList>
                    <CommandEmpty>No tags found.</CommandEmpty>
                    <CommandGroup>{tags.map(renderTagItem)}</CommandGroup>
                  </CommandList>
                </Command>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col sm:flex-row gap-4">
          <Button variant="outline" className="w-full sm:w-1/2" onClick={resetAllFilters}>
            Reset
          </Button>
          <Button className="w-full sm:w-1/2" onClick={applyFilters}>
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
