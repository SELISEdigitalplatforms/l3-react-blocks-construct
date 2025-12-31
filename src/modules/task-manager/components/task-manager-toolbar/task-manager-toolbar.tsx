import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlignJustify, Columns3, ListFilter, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui-kit/input';
import { Button } from '@/components/ui-kit/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui-kit/tabs';
import {
  TaskManagerFilterSheet,
  TaskFilters,
} from '../task-manager-filters-sheet/task-manager-filters-sheet';
import { ItemTag } from '../../types/task-manager.types';

/**
 * TaskManagerToolbar Component
 *
 * A reusable toolbar component for managing tasks in a task manager application.
 * This component supports:
 * - Switching between board and list views
 * - Searching for tasks
 * - Opening a modal to add new tasks
 * - Managing filters via a filter sheet
 *
 * Features:
 * - Responsive design with separate layouts for mobile and desktop views
 * - Search functionality with a clear button
 * - View mode toggle between "board" and "list"
 * - Integration with the `TaskManagerFilterSheet` for filtering tasks
 *
 * Props:
 * @param {() => void} onOpen - Callback to open the task creation modal
 * @param {string} [viewMode='board'] - The current view mode ('board' or 'list')
 * @param {(view: string) => void} handleViewMode - Callback to change the view mode
 *
 * @example
 * // Basic usage
 * <TaskManagerToolbar
 *   onOpen={() => console.log('Open task modal')}
 *   viewMode="board"
 *   handleViewMode={(view) => console.log('View mode changed:', view)}
 * />
 */

export type ViewMode = 'board' | 'list';

interface TaskManagerToolbarProps {
  viewMode: ViewMode;
  handleViewMode: (view: ViewMode) => void;
  onOpen: () => void;
  onSearch?: (query: string) => void;
  priorities?: string[];
  statuses?: string[];
  assignees?: { id: string; name: string }[];
  tags: ItemTag[];
  filters?: TaskFilters;
  onApplyFilters?: (filters: TaskFilters) => void;
  onResetFilters?: () => void;
}

export default function TaskManagerToolbar({
  onOpen,
  viewMode = 'board',
  handleViewMode,
  onSearch,
  priorities = [],
  statuses = [],
  assignees = [],
  tags = [],
  filters = { priorities: [], statuses: [], assignees: [], tags: [] },
  onApplyFilters,
  onResetFilters,
}: Readonly<TaskManagerToolbarProps>) {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [openSheet, setOpenSheet] = useState(false);

  // fallback handlers when not provided
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noop = () => {};
  const applyFiltersHandler = onApplyFilters ?? noop;
  const resetFiltersHandler = onResetFilters ?? noop;

  useEffect(() => {
    if (openSheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [openSheet]);

  useEffect(() => {
    if (onSearch && typeof onSearch === 'function') {
      const query = searchQuery.trim().toLowerCase();
      onSearch(query);
    }
  }, [searchQuery, onSearch]);

  const handleTaskModalOpen = () => {
    onOpen();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="flex md:justify-between md:items-center md:flex-row md:gap-0 flex-col gap-3 w-full">
      <div className="flex justify-between w-full">
        <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">
          {t('TASK_MANAGER')}
        </h3>
        <Button onClick={handleTaskModalOpen} size="sm" className="h-8 flex md:hidden">
          <Plus className="h-4 w-4" />
          {t('ADD_ITEM')}
        </Button>
      </div>
      <div className="flex gap-2">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 bg-background" />
          <Input
            placeholder={t('SEARCH')}
            value={searchQuery}
            onChange={handleSearchChange}
            className="h-8 w-full rounded-lg bg-background pl-8"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              ✕
            </button>
          )}
        </div>
        <Button onClick={() => setOpenSheet(true)} variant="outline" size="sm" className="h-8 px-3">
          <ListFilter className="h-4 w-4" />
        </Button>
        <Tabs
          value={viewMode}
          onValueChange={(value) => {
            if (value === 'board' || value === 'list') {
              handleViewMode(value);
            }
          }}
        >
          <TabsList className="border rounded-lg flex h-8">
            <TabsTrigger value="board">
              <Columns3 className="h-3 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list">
              <AlignJustify className="h-3 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          onClick={handleTaskModalOpen}
          size="sm"
          className="h-8 hidden md:flex text-sm font-bold"
        >
          <Plus />
          {t('ADD_ITEM')}
        </Button>
      </div>
      <TaskManagerFilterSheet
        open={openSheet}
        onOpenChange={setOpenSheet}
        priorities={priorities}
        statuses={statuses}
        assignees={assignees}
        tags={tags}
        value={filters}
        onApply={applyFiltersHandler}
        onReset={resetFiltersHandler}
      />
    </div>
  );
}
