import { useEffect, useMemo, useCallback } from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import { useCardTasks } from 'features/task-manager/hooks/use-card-tasks';
import { useGetTaskSections } from 'features/task-manager/hooks/use-task-manager';
import { useToast } from 'hooks/use-toast';
import { useDeviceCapabilities } from 'hooks/use-device-capabilities';
import { Skeleton } from 'components/ui/skeleton';
import {
  TaskSection,
  TaskSectionWithTasks,
  TaskItem,
  ItemTag,
} from 'features/task-manager/types/task-manager.types';
import { TaskColumn } from 'features/task-manager/components/card-view/task-column';
import { AddColumn } from '../../features/task-manager/components/modals/add-column';
import { TaskDragOverlay } from 'features/task-manager/components/card-view/task-drag-overlay';
import { AddTask } from '../../features/task-manager/components/modals/add-task';
import TaskDetailsView from 'features/task-manager/components/task-details-view/task-details-view';
import { Dialog } from 'components/ui/dialog';

/**
 * TaskCardView Component
 *
 * A card-based (Kanban-style) task board for managing tasks within draggable columns.
 * Built using `@dnd-kit/core` for drag-and-drop and external task management
 * via the `useGetTaskSections` hook. Supports adaptive drag sensitivity based on device.
 *
 * Features:
 * - Drag-and-drop columns and tasks
 * - Touch & mouse sensor adaptation using `useDeviceCapabilities`
 * - Inline task and column creation
 * - Modal support for task details
 * - External "Add Task" dialog support
 *
 * Props:
 * @param {any} task - (Unused) legacy prop
 * @param {any} taskService - Service for interacting with task details
 * @param {boolean} isNewTaskModalOpen - Controls visibility of the task details modal
 * @param {(isOpen: boolean) => void} setNewTaskModalOpen - Handler to toggle task modal state
 * @param {() => void} [onTaskAdded] - Optional callback triggered after task creation
 *
 * @returns {JSX.Element} A drag-and-drop-enabled Kanban board for tasks
 *
 * @example
 * <TaskCardView
 *   taskService={myTaskService}
 *   isNewTaskModalOpen={isModalOpen}
 *   setNewTaskModalOpen={setModalOpen}
 *   onTaskAdded={() => refreshTasks()}
 * />
 */

interface TaskCardViewProps {
  isNewTaskModalOpen?: boolean;
  setNewTaskModalOpen: (isOpen: boolean) => void;
  searchQuery?: string;
  filters: {
    priorities: string[];
    statuses: string[];
    assignees: string[];
    tags: ItemTag[];
    dueDate?: {
      from?: Date;
      to?: Date;
    };
  };
}

export function TaskCardView({
  isNewTaskModalOpen,
  setNewTaskModalOpen,
  searchQuery = '',
  filters,
}: Readonly<TaskCardViewProps>) {
  const { touchEnabled } = useDeviceCapabilities();
  const { t } = useTranslation();

  const { data: sectionsData, isLoading } = useGetTaskSections({
    pageNo: 1,
    pageSize: 100,
  });

  const { toast } = useToast();

  const {
    columns,
    activeColumn,
    activeTask,
    setActiveColumn,
    addColumn,
    renameColumn,
    deleteColumn,
    addTask: addTaskToColumn,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    sensors,
  } = useCardTasks({
    searchQuery,
    filters: {
      priorities: filters.priorities,
      statuses: filters.statuses,
      assignees: filters.assignees,
      tags: filters.tags,
      dueDate: filters.dueDate,
    },
  });

  const handleAddTask = useCallback(
    async (columnId: string, content: string) => {
      try {
        const taskId = await addTaskToColumn(columnId, content);
        return taskId;
      } catch (error) {
        toast({
          variant: 'destructive',
          title: t('UNABLE_CREATE_TASK'),
          description: t('FAILED_CREATE_TASK'),
        });
        console.error('Error adding task:', error);
        throw error;
      }
    },
    [addTaskToColumn, toast, t]
  );

  const taskMatchesSearchQuery = (task: TaskItem, query: string): boolean => {
    const lowerQuery = query.toLowerCase();
    const matchesBasicFields =
      task.Title?.toLowerCase().includes(lowerQuery) ||
      task.Description?.toLowerCase().includes(lowerQuery);

    const matchesItemTag = task.ItemTag?.some(
      (tag) =>
        tag.TagLabel?.toLowerCase().includes(lowerQuery) ||
        tag.ItemId?.toLowerCase().includes(lowerQuery)
    );

    const matchesTags = task.Tags?.some(
      (tag) => typeof tag === 'string' && tag.toLowerCase().includes(lowerQuery)
    );

    return matchesBasicFields || matchesItemTag || matchesTags || false;
  };

  const taskMatchesTagFilter = (
    task: TaskItem,
    filterTags: Array<string | { ItemId: string }>
  ): boolean => {
    if (!task.ItemTag) return false;

    return task.ItemTag.some((tag) =>
      filterTags.some((filterTag) => {
        if (typeof filterTag === 'string') {
          return tag.ItemId === filterTag || tag.TagLabel === filterTag;
        }
        return tag.ItemId === filterTag.ItemId;
      })
    );
  };

  const apiColumns = useMemo<TaskSectionWithTasks[]>(() => {
    if (!sectionsData?.TaskManagerSections?.items) return [];

    return sectionsData.TaskManagerSections.items.map((section): TaskSectionWithTasks => {
      const sectionTasks = section.tasks || [];
      let tasks = searchQuery
        ? sectionTasks.filter((task) => taskMatchesSearchQuery(task, searchQuery))
        : [...sectionTasks];

      // Apply tag filters if any
      if (filters.tags.length > 0) {
        tasks = tasks.filter((task) => taskMatchesTagFilter(task, filters.tags));
      }

      return {
        ...section,
        IsDeleted: section.IsDeleted || false,
        Language: section.Language || 'en',
        LastUpdatedBy: section.LastUpdatedBy,
        LastUpdatedDate: section.LastUpdatedDate,
        OrganizationIds: section.OrganizationIds || [],
        Tags: section.Tags || [],
        tasks: tasks,
      };
    });
  }, [sectionsData, searchQuery, filters.tags]);

  const handleAddColumn = useCallback(
    async (title: string) => {
      try {
        const newSectionId = await addColumn(title);

        if (!newSectionId) {
          throw new Error('No section ID returned from server');
        }

        toast({
          variant: 'success',
          title: t('COLUMN_CREATED'),
          description: t('NEW_COLUMN_CREATED_SUCCESSFULLY'),
        });
      } catch (error) {
        console.error('Error creating column:', error);
        toast({
          variant: 'destructive',
          title: t('COLUMN_CREATION_FAILED'),
          description: error instanceof Error ? error.message : t('FAILED_TO_CREATE_COLUMN'),
        });
      }
    },
    [addColumn, toast, t]
  );

  useEffect(() => {
    const handleSetActiveColumn = (event: Event) => {
      const customEvent = event as CustomEvent;
      const columnId = customEvent.detail;
      setActiveColumn(columnId);
    };

    document.addEventListener('setActiveColumn', handleSetActiveColumn);
    return () => {
      document.removeEventListener('setActiveColumn', handleSetActiveColumn);
    };
  }, [setActiveColumn]);

  if (isLoading) {
    return (
      <div className="flex space-x-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-64 p-4 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        autoScroll={true}
        measuring={{
          draggable: {
            measure: (element) => element.getBoundingClientRect(),
          },
        }}
      >
        <div
          className={`flex overflow-x-auto p-4 h-full ${touchEnabled ? 'touch-pan-x' : ''}`}
          style={{
            touchAction: touchEnabled ? 'pan-x' : 'auto',
          }}
        >
          <div className="flex space-x-4 min-h-full">
            {apiColumns.map((column: TaskSection) => {
              const columnTasks = columns.find((col) => col.ItemId === column.ItemId)?.tasks || [];

              const filteredTasks = columnTasks.filter(
                (task) => task.Title?.toLowerCase().includes(searchQuery.toLowerCase()) // Apply the filtering
              );

              return (
                <TaskColumn
                  key={column.ItemId}
                  column={column}
                  tasks={filteredTasks}
                  sections={apiColumns}
                  setActiveColumn={setActiveColumn}
                  onAddTask={handleAddTask}
                  onRenameColumn={(columnId, newTitle) => renameColumn(columnId, newTitle)}
                  onDeleteColumn={(columnId) => deleteColumn(columnId)}
                />
              );
            })}

            <div className="flex items-start pt-10 px-2">
              <AddColumn onAddColumn={handleAddColumn} />
            </div>
          </div>
        </div>

        <DragOverlay>{activeTask && <TaskDragOverlay activeTask={activeTask} />}</DragOverlay>
      </DndContext>

      <AddTask
        activeColumn={activeColumn}
        columns={columns}
        onAddTask={async (columnId, content) => {
          try {
            await handleAddTask(columnId, content);
          } catch (error) {
            console.error('Error in AddTaskDialog:', error);
          }
        }}
      />

      <Dialog open={isNewTaskModalOpen} onOpenChange={setNewTaskModalOpen}>
        <TaskDetailsView
          onClose={() => setNewTaskModalOpen(false)}
          isNewTaskModalOpen={isNewTaskModalOpen}
        />
      </Dialog>
    </div>
  );
}

export default TaskCardView;
