import { useState, useMemo } from 'react';
import TaskListView from '../../components/task-list-view/task-list-view';
import TaskManagerToolbar, {
  ViewMode,
} from '../../components/task-manager-toolbar/task-manager-toolbar';
import { TaskFilters } from '../../components/task-manager-filters-sheet/task-manager-filters-sheet';
import { useListTasks } from '../../hooks/use-list-tasks';
import { useGetTaskSections, useGetTaskTags, useGetUsers } from '../../hooks/use-task-manager';
import { ItemTag } from '../../types/task-manager.types';
import { TaskCardView } from '../../components/task-card-view/task-card-view';

/**
 * TaskManager Component
 *
 * A central task management component that enables users to view, add, and manage tasks.
 * Supports both list and board (card) views, and handles state for view modes and task data.
 *
 * Features:
 * - Board and list view modes for task visualization
 * - Integration with `TaskService` for task retrieval
 * - New task modal handling
 * - Toolbar for user interaction and view toggling
 * - Context providers for shared task state and logic
 *
 * @example
 * // Usage in a route or page
 * <TaskManager />
 */

export const TaskManagerPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({
    priorities: [],
    statuses: [],
    assignees: [],
    tags: [],
  });
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const onOpen = () => {
    setIsNewTaskModalOpen(true);
  };

  const { tasks } = useListTasks();

  const { data: sectionsData } = useGetTaskSections({ pageNo: 1, pageSize: 100 });
  const { data: tagsData } = useGetTaskTags({ pageNo: 1, pageSize: 100 });
  const { data: usersData } = useGetUsers({ page: 0, pageSize: 100 });

  const priorities = useMemo(() => {
    const allPriorities = ['High', 'Medium', 'Low'];
    const taskPriorities = new Set<string>();
    tasks.forEach((t) => t.Priority && taskPriorities.add(t.Priority));
    taskPriorities.forEach((p) => !allPriorities.includes(p) && allPriorities.push(p));
    return allPriorities;
  }, [tasks]);

  const statuses = useMemo(() => {
    if (sectionsData?.TaskManagerSections?.items?.length) {
      return sectionsData.TaskManagerSections.items.map((s: { Title: string }) => s.Title);
    }
    const statusSet = new Set<string>();
    tasks.forEach((t) => t.Section && statusSet.add(t.Section));
    return Array.from(statusSet);
  }, [tasks, sectionsData]);

  const assignees = useMemo(() => {
    if (Array.isArray(usersData) && usersData.length) {
      return usersData.map((u) => ({
        id: u.itemId,
        name:
          [u.firstName, u.lastName].filter(Boolean).join(' ').trim() ||
          u.userName ||
          u.email ||
          'Unknown User',
      }));
    }
    const assigneeMap = new Map<string, string>();
    tasks.forEach((t) => {
      t.Assignee?.forEach((a) => {
        if (a.ItemId && a.Name) assigneeMap.set(a.ItemId, a.Name);
      });
    });
    return Array.from(assigneeMap.entries()).map(([id, name]) => ({ id, name }));
  }, [tasks, usersData]);

  const tags = useMemo<ItemTag[]>(() => {
    if (tagsData?.TaskManagerTags?.items?.length) {
      return tagsData.TaskManagerTags.items.map((tag: { ItemId: string; Label: string }) => ({
        ItemId: tag.ItemId,
        TagLabel: tag.Label,
      }));
    }
    const tagMap = new Map<string, string>();
    tasks.forEach((t) => {
      t.Tags?.filter(Boolean).forEach((tag) => {
        tagMap.set(tag, tag);
      });
    });
    return Array.from(tagMap.entries()).map(([ItemId, TagLabel]) => ({ ItemId, TagLabel }));
  }, [tasks, tagsData]);

  const handleApplyFilters = (f: TaskFilters) => {
    setFilters(f);
  };

  const handleResetFilters = () => {
    setFilters({ priorities: [], statuses: [], assignees: [], tags: [] });
  };

  const handleViewMode = (view: ViewMode) => {
    setViewMode(view);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-4 whitespace-nowrap md:mb-8">
        <TaskManagerToolbar
          viewMode={viewMode}
          handleViewMode={handleViewMode}
          onOpen={onOpen}
          onSearch={(query) => {
            setSearchQuery(query);
          }}
          priorities={priorities}
          statuses={statuses}
          assignees={assignees}
          tags={tags}
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      </div>

      {viewMode === 'board' && (
        <TaskCardView
          isNewTaskModalOpen={isNewTaskModalOpen}
          setNewTaskModalOpen={setIsNewTaskModalOpen}
          searchQuery={searchQuery}
          filters={filters}
        />
      )}
      {viewMode === 'list' && (
        <TaskListView
          searchQuery={searchQuery}
          filters={filters}
          isNewTaskModalOpen={isNewTaskModalOpen}
          setNewTaskModalOpen={setIsNewTaskModalOpen}
        />
      )}
    </div>
  );
};
