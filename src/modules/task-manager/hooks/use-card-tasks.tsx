import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  ItemTag,
  TaskItem,
  TaskPriority,
  TaskSection,
  TaskSectionWithTasks,
} from '../types/task-manager.types';
import {
  useGetTasks,
  useGetTaskSections,
  useCreateTaskItem,
  useUpdateTaskItem,
  useCreateTaskSection,
  useUpdateTaskSection,
  useDeleteTaskSection,
} from './use-task-manager';
import { useToast } from '@/hooks/use-toast';
import { useDeviceCapabilities } from '@/modules/file-manager/hooks/use-device-capabilities';

/**
 * useCardTasks Hook
 *
 * A custom hook for managing tasks and columns in a Kanban-style task manager.
 * This hook supports:
 * - Adding, renaming, and deleting columns
 * - Adding tasks to columns
 * - Drag-and-drop functionality for reordering tasks and moving them between columns
 *
 * Features:
 * - Integrates with the `@dnd-kit` library for drag-and-drop functionality
 * - Provides sensors for touch, pointer, and mouse interactions
 * - Manages active tasks and columns during drag-and-drop operations
 *
 * @returns {Object} An object containing task and column management functions, sensors, and state
 *
 * @example
 * // Basic usage
 * const {
 *   columns,
 *   addColumn,
 *   renameColumn,
 *   deleteColumn,
 *   addTask,
 *   handleDragStart,
 *   handleDragOver,
 *   handleDragEnd,
 * } = useCardTasks();
 */

interface UseCardTasksProps {
  searchQuery?: string;
  filters?: {
    priorities?: string[];
    statuses?: string[];
    assignees?: string[];
    tags?: Array<{ ItemId: string; TagLabel: string }>;
    dueDate?: {
      from?: Date;
      to?: Date;
    };
  };
}

export function useCardTasks({ searchQuery = '', filters = {} }: UseCardTasksProps = {}) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [columnTasks, setColumnTasks] = useState<TaskSectionWithTasks[]>([]);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const { mutateAsync: createTask } = useCreateTaskItem();
  const { mutateAsync: updateTask } = useUpdateTaskItem();
  const { mutateAsync: createSection } = useCreateTaskSection();
  const { mutateAsync: updateSection } = useUpdateTaskSection();
  const { mutateAsync: deleteSection } = useDeleteTaskSection();

  const { data: sectionsData } = useGetTaskSections({
    pageNo: 1,
    pageSize: 100,
  });

  const ensureTaskItem = useCallback((task: TaskItem): TaskItem => {
    return {
      ItemId: task.ItemId ?? '',
      Title: task.Title ?? '',
      Description: task.Description ?? '',
      IsCompleted: task.IsCompleted ?? false,
      Priority: task.Priority ?? TaskPriority.MEDIUM,
      Section: task.Section ?? '',
      ItemTag: task.ItemTag ?? [],
      Assignee: task.Assignee ?? [],
      AttachmentField: task.AttachmentField ?? [],
      CreatedBy: task.CreatedBy ?? '',
      CreatedDate: task.CreatedDate ?? new Date().toISOString(),
      LastUpdatedBy: task.LastUpdatedBy ?? '',
      LastUpdatedDate: task.LastUpdatedDate ?? new Date().toISOString(),
      DueDate: task.DueDate ?? '',
      IsDeleted: task.IsDeleted ?? false,
      Language: task.Language ?? '',
      OrganizationIds: task.OrganizationIds ?? [],
    };
  }, []);

  const {
    data: tasksData,
    isLoading: isLoadingTasks,
    refetch: refetchTasks,
  } = useGetTasks({
    pageNo: 1,
    pageSize: 100,
  });

  const { touchEnabled, screenSize } = useDeviceCapabilities();

  useEffect(() => {
    if (!sectionsData?.TaskManagerSections?.items) return;

    const currentFilters = {
      priorities: filters.priorities ?? [],
      statuses: filters.statuses ?? [],
      assignees: filters.assignees ?? [],
      tags: filters.tags ?? [],
      dueDate: filters.dueDate ?? {},
    };

    setColumnTasks(() => {
      const filteredSections = sectionsData.TaskManagerSections.items.filter(
        (section: TaskSection) =>
          !currentFilters.statuses.length ||
          (section.Title && currentFilters.statuses.includes(section.Title))
      );

      const sectionsByTitle = new Map<string, TaskSection>();
      filteredSections.forEach((section: TaskSection) => {
        if (section.Title) {
          sectionsByTitle.set(section.Title, section);
        }
      });

      const sectionsById = new Map<string, TaskSection>();
      filteredSections.forEach((section: TaskSection) => {
        if (section.ItemId) {
          sectionsById.set(section.ItemId, section);
        }
      });

      const tasksBySectionId: Record<string, TaskItem[]> = {};
      filteredSections.forEach((section: TaskSection) => {
        tasksBySectionId[section.ItemId] = [];
      });

      const hasMatchingLabel = (label: string | undefined, query: string): boolean => {
        if (!label) return false;
        return label.toLowerCase().includes(query.toLowerCase());
      };

      const hasMatchingTag = (tags: ItemTag[] | undefined, query: string): boolean => {
        if (!tags?.length || !query) return false;
        return tags.some((tag) => hasMatchingLabel(tag.TagLabel, query));
      };

      const matchesSearchQuery = (task: TaskItem, query: string): boolean => {
        if (!query) return true;

        const queryLower = query.toLowerCase();
        const titleMatch = task.Title?.toLowerCase().includes(queryLower) || false;
        const descriptionMatch = task.Description?.toLowerCase().includes(queryLower) || false;
        const tagMatch = hasMatchingTag(task.ItemTag, queryLower);

        return titleMatch || descriptionMatch || tagMatch;
      };

      const matchesPriorityFilter = (task: TaskItem): boolean => {
        return !(
          currentFilters.priorities.length &&
          task.Priority &&
          !currentFilters.priorities.includes(task.Priority)
        );
      };

      const isAssigneeInFilter = (assignee: { ItemId?: string | null }): boolean => {
        return Boolean(assignee.ItemId && currentFilters.assignees.includes(assignee.ItemId));
      };

      const matchesAssigneeFilter = (task: TaskItem): boolean => {
        if (!currentFilters.assignees.length || !task.Assignee?.length) return true;
        return task.Assignee.some(isAssigneeInFilter);
      };

      const hasMatchingTagInFilter = (tag: ItemTag): boolean => {
        const { ItemId } = tag;
        if (!ItemId) return false;

        return currentFilters.tags.some((filterTag) => filterTag.ItemId === ItemId);
      };

      const matchesTagsFilter = (task: TaskItem): boolean => {
        if (!currentFilters.tags.length || !task.ItemTag?.length) return true;
        return task.ItemTag.some(hasMatchingTagInFilter);
      };

      const matchesDueDateFilter = (task: TaskItem): boolean => {
        if ((!currentFilters.dueDate?.from && !currentFilters.dueDate?.to) || !task.DueDate) {
          return true;
        }
        const dueDate = new Date(task.DueDate);
        if (currentFilters.dueDate?.from && dueDate < currentFilters.dueDate.from) return false;
        if (currentFilters.dueDate?.to && dueDate > currentFilters.dueDate.to) return false;
        return true;
      };

      const findSectionByReference = (ref: string): TaskSection | undefined => {
        if (!ref) return undefined;
        const byTitle = sectionsByTitle.get(ref);
        if (byTitle) return byTitle;

        return sectionsById.get(ref);
      };

      const ensureSectionTasksArray = (sectionId: string): TaskItem[] => {
        if (!tasksBySectionId[sectionId]) {
          tasksBySectionId[sectionId] = [];
        }
        return tasksBySectionId[sectionId];
      };

      const addTaskToSection = (task: TaskItem): void => {
        if (!task.Section) return;

        const section = findSectionByReference(task.Section);
        if (!section) return;

        const sectionTasks = ensureSectionTasksArray(section.ItemId);
        sectionTasks.push(ensureTaskItem(task));
      };

      if (tasksData?.TaskManagerItems?.items) {
        tasksData.TaskManagerItems.items.forEach((task: TaskItem) => {
          if (!matchesSearchQuery(task, searchQuery)) return;
          if (!matchesPriorityFilter(task)) return;
          if (!matchesAssigneeFilter(task)) return;
          if (!matchesTagsFilter(task)) return;
          if (!matchesDueDateFilter(task)) return;

          addTaskToSection(task);
        });
      }

      const newColumns = filteredSections.map((section: TaskSection) => ({
        ...section,
        tasks: tasksBySectionId[section.ItemId] || [],
      }));

      return newColumns;
    });
  }, [
    sectionsData,
    tasksData,
    searchQuery,
    filters.priorities,
    filters.statuses,
    filters.assignees,
    filters.tags,
    filters.dueDate,
    ensureTaskItem,
  ]);

  const getColumnCount = (size: string) => {
    return size === 'tablet' ? 5 : 3;
  };

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: screenSize === 'mobile' ? 300 : 200,
      tolerance: screenSize === 'mobile' ? 8 : 5,
    },
  });

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: screenSize === 'mobile' ? 8 : getColumnCount(screenSize),
    },
  });

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: screenSize === 'tablet' ? 5 : 10,
    },
  });

  const sensors = useSensors(
    touchEnabled ? touchSensor : null,
    screenSize === 'tablet' ? mouseSensor : null,
    pointerSensor
  );

  const createColumn = useCallback(
    async (title: string) => {
      if (!title.trim()) return null;

      try {
        const response = await createSection({ Title: title });
        const newSectionId = response?.insertTaskManagerSection?.itemId;

        if (!newSectionId) {
          console.error('No section ID found in response. Full response:', response);
          throw new Error('No section ID returned in the response');
        }

        const newColumn: TaskSectionWithTasks = {
          ItemId: newSectionId,
          Title: title,
          CreatedBy: '',
          CreatedDate: new Date().toISOString(),
          IsDeleted: false,
          Language: 'en',
          OrganizationIds: [],
          tasks: [],
        };

        setColumnTasks((prev) => [...prev, newColumn]);
        return newSectionId;
      } catch (error) {
        console.error('Error in createColumn:', error);
        throw error;
      }
    },
    [createSection, setColumnTasks]
  );

  const renameColumn = useCallback(
    async (columnId: string, newTitle: string) => {
      if (!newTitle.trim()) return;

      try {
        await updateSection({
          sectionId: columnId,
          input: { Title: newTitle },
        });

        setColumnTasks((prev) =>
          prev.map((column) =>
            column.ItemId === columnId ? { ...column, Title: newTitle } : column
          )
        );
      } catch (error) {
        toast({
          variant: 'destructive',
          title: t('SECTION_UPDATE_FAILED'),
          description: t('FAILED_UPDATE_SECTION'),
        });
        console.error('Error updating section:', error);
      }
    },
    [updateSection, toast, t]
  );

  const removeColumn = useCallback(
    async (columnId: string) => {
      try {
        await deleteSection(columnId);
        setColumnTasks((prev) => prev.filter((column) => column.ItemId !== columnId));
      } catch (error) {
        toast({
          variant: 'destructive',
          title: t('SECTION_DELETION_FAILED'),
          description: t('FAILED_DELETE_SECTION'),
        });
        console.error('Error deleting section:', error);
      }
    },
    [deleteSection, toast, t]
  );

  const addTaskToColumn = useCallback(
    async (columnId: string, content: string): Promise<string | null> => {
      if (!content.trim()) return null;

      try {
        const section = columnTasks.find((col: TaskSection) => col.ItemId === columnId);
        if (!section) {
          const errorMessage = `Section not found for column ${columnId}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }

        const sectionTitle = section.Title;
        if (!sectionTitle) {
          throw new Error(`Section title is empty for column ${columnId}`);
        }

        const tempTask: TaskItem = {
          ItemId: `temp-${Date.now()}`,
          Title: content,
          Description: '',
          Section: sectionTitle,
          IsCompleted: false,
          Language: 'en',
          OrganizationIds: [],
          Priority: TaskPriority.MEDIUM,
          ItemTag: [],
          CreatedBy: '',
          CreatedDate: new Date().toISOString(),
          DueDate: new Date().toISOString(),
          IsDeleted: false,
        };

        setColumnTasks((prev) =>
          prev.map((column) =>
            column.ItemId === columnId ? { ...column, tasks: [...column.tasks, tempTask] } : column
          )
        );

        try {
          const taskData = {
            Title: content,
            Description: '',
            Section: sectionTitle,
            IsCompleted: false,
            Language: 'en',
            OrganizationIds: [],
            Priority: TaskPriority.MEDIUM,
            ItemTag: [],
            DueDate: new Date().toISOString(),
          };

          const response = await createTask(taskData);

          const taskId = response?.insertTaskManagerItem?.itemId;

          if (!taskId) {
            const removeTaskIfMatches = (tasks: TaskItem[]): TaskItem[] =>
              tasks.filter((task) => task.ItemId !== tempTask.ItemId);

            const removeTempTask = (prevColumns: TaskSectionWithTasks[]): TaskSectionWithTasks[] =>
              prevColumns.map((column) => {
                if (column.ItemId !== columnId) {
                  return column;
                }
                return {
                  ...column,
                  tasks: removeTaskIfMatches(column.tasks),
                };
              });

            setColumnTasks(removeTempTask);
            throw new Error('Failed to create task: No task ID returned from server');
          }

          const updateTaskId = (task: TaskItem): TaskItem =>
            task.ItemId === tempTask.ItemId ? { ...task, ItemId: taskId } : task;

          const updateColumnTasks = (column: TaskSectionWithTasks): TaskSectionWithTasks =>
            column.ItemId === columnId
              ? { ...column, tasks: column.tasks.map(updateTaskId) }
              : column;

          setColumnTasks((prev) => prev.map(updateColumnTasks));

          await refetchTasks();

          return taskId;
        } catch (error) {
          console.error('Error in createTask mutation:', error);
          const filterOutTempTask = (tasks: TaskItem[]): TaskItem[] =>
            tasks.filter((task) => task.ItemId !== tempTask.ItemId);

          const updateColumnOnError = (column: TaskSectionWithTasks): TaskSectionWithTasks =>
            column.ItemId === columnId
              ? { ...column, tasks: filterOutTempTask(column.tasks) }
              : column;

          setColumnTasks((prev) => prev.map(updateColumnOnError));
          throw new Error(
            error instanceof Error ? error.message : 'Failed to create task on the server'
          );
        }
      } catch (error) {
        console.error('Error in addTaskToColumn:', error);
        toast({
          variant: 'destructive',
          title: t('TASK_CREATION_FAILED'),
          description: error instanceof Error ? error.message : t('FAILED_CREATE_TASK'),
        });
        throw error;
      }
    },
    [createTask, toast, columnTasks, refetchTasks, t]
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.isScrolling) {
      return;
    }

    const { active } = event;
    const activeId = active.id.toString();

    if (typeof activeId === 'string' && activeId.startsWith('task-')) {
      const taskId = activeId.replace('task-', '');

      for (const column of columnTasks) {
        const task = column.tasks.find((t) => t.ItemId === taskId);
        if (task) {
          setActiveTask(ensureTaskItem(task));
          break;
        }
      }
    }
  };

  const handleColumnDrag = useCallback(
    async (activeTaskId: string, targetColumnId: string, sourceColumnIndex: number) => {
      const targetColumnIndex = columnTasks.findIndex((col) => col.ItemId === targetColumnId);

      if (targetColumnIndex === -1 || sourceColumnIndex === targetColumnIndex) return;

      // Create a deep copy of the columns to avoid reference issues
      const newColumns = JSON.parse(JSON.stringify(columnTasks));
      const sourceTasks = [...newColumns[sourceColumnIndex].tasks];
      const activeTaskIndex = sourceTasks.findIndex((task) => task.ItemId === activeTaskId);

      if (activeTaskIndex === -1) return;

      // Remove the task from the source column
      const [movedTask] = sourceTasks.splice(activeTaskIndex, 1);
      if (!movedTask) return;

      // Get the target column's title
      const targetSectionTitle = newColumns[targetColumnIndex].Title;

      try {
        // Update the task on the server first
        await updateTask({
          itemId: movedTask.ItemId,
          input: {
            Section: targetSectionTitle,
          },
        });

        // Get the target tasks and remove any existing task with the same ID
        const targetTasks = [...(newColumns[targetColumnIndex].tasks || [])];
        const existingTaskIndex = targetTasks.findIndex((task) => task.ItemId === movedTask.ItemId);
        if (existingTaskIndex !== -1) {
          targetTasks.splice(existingTaskIndex, 1);
        }

        // Create the updated task with the new section
        const updatedTask = {
          ...movedTask,
          Section: targetSectionTitle,
        };

        // Add the task to the target column
        targetTasks.push(updatedTask);

        // Update the state
        setColumnTasks((prevColumns) => {
          const newState = [...prevColumns];
          newState[sourceColumnIndex] = {
            ...newState[sourceColumnIndex],
            tasks: sourceTasks,
          };
          newState[targetColumnIndex] = {
            ...newState[targetColumnIndex],
            tasks: targetTasks,
          };
          return newState;
        });

        // Refetch tasks to ensure everything is in sync
        await refetchTasks();
      } catch (error) {
        console.error('Error moving task to column:', error);
        toast({
          variant: 'destructive',
          title: t('TASK_MOVE_FAILED'),
          description: t('FAILED_MOVE_THE_TASK'),
        });
        refetchTasks();
      }
    },
    [columnTasks, updateTask, toast, refetchTasks, t]
  );

  const handleTaskDrag = useCallback(
    async (activeTaskId: string, overTaskId: string, sourceColumnIndex: number) => {
      const targetColumnIndex = columnTasks.findIndex((col) =>
        col.tasks.some((task) => task.ItemId === overTaskId)
      );

      if (targetColumnIndex === -1 || sourceColumnIndex === -1) return;

      const newColumns = JSON.parse(JSON.stringify(columnTasks));
      const sourceTasks = [...newColumns[sourceColumnIndex].tasks];
      const sourceTaskIndex = sourceTasks.findIndex((task) => task.ItemId === activeTaskId);

      if (sourceTaskIndex === -1) return;

      // Remove the task from the source column
      const [movedTask] = sourceTasks.splice(sourceTaskIndex, 1);
      if (!movedTask) return;

      // Get the target column's title
      const targetSectionTitle = newColumns[targetColumnIndex].Title;

      try {
        // Update the task on the server first
        await updateTask({
          itemId: movedTask.ItemId,
          input: {
            Section: targetSectionTitle,
          },
        });

        // Get the target tasks and remove any existing task with the same ID
        const targetTasks = [...(newColumns[targetColumnIndex].tasks || [])];
        const existingTaskIndex = targetTasks.findIndex((task) => task.ItemId === movedTask.ItemId);
        if (existingTaskIndex !== -1) {
          targetTasks.splice(existingTaskIndex, 1);
        }

        // Find the position to insert the task
        const overTaskIndex = targetTasks.findIndex((task) => task.ItemId === overTaskId);
        const insertIndex = overTaskIndex !== -1 ? overTaskIndex : targetTasks.length;

        // Create the updated task with the new section
        const updatedTask = {
          ...movedTask,
          Section: targetSectionTitle,
        };

        // Insert the task at the correct position
        targetTasks.splice(insertIndex, 0, updatedTask);

        // Update the state
        setColumnTasks((prevColumns) => {
          const newState = [...prevColumns];
          newState[sourceColumnIndex] = {
            ...newState[sourceColumnIndex],
            tasks: sourceTasks,
          };
          newState[targetColumnIndex] = {
            ...newState[targetColumnIndex],
            tasks: targetTasks,
          };
          return newState;
        });

        await refetchTasks();
      } catch (error) {
        console.error('Error moving task:', error);
        toast({
          variant: 'destructive',
          title: t('TASK_MOVE_FAILED'),
          description: t('FAILED_MOVE_THE_TASK'),
        });
        refetchTasks();
      }
    },
    [columnTasks, updateTask, toast, refetchTasks, t]
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    const isActiveATask = activeId.startsWith('task-');
    const isOverATask = overId.startsWith('task-');
    const isOverAColumn = overId.startsWith('column-');

    if (!isActiveATask) return;

    // Find the task being dragged
    const activeTaskId = activeId.replace('task-', '');
    const sourceColumnIndex = columnTasks.findIndex((col) =>
      col.tasks.some((task) => task.ItemId === activeTaskId)
    );

    if (sourceColumnIndex === -1) return;

    if (isOverATask) {
      const overTaskId = overId.replace('task-', '');
      handleTaskDrag(activeTaskId, overTaskId, sourceColumnIndex);
    } else if (isOverAColumn) {
      const targetColumnId = overId.replace('column-', '');
      const targetColumnIndex = columnTasks.findIndex((col) => col.ItemId === targetColumnId);

      if (targetColumnIndex !== -1) {
        handleColumnDrag(activeTaskId, targetColumnId, sourceColumnIndex);
      }
    }
  };

  const findTaskLocation = (taskId: string) => {
    for (let i = 0; i < columnTasks.length; i++) {
      const taskIndex = columnTasks[i].tasks.findIndex((t) => t.ItemId === taskId);
      if (taskIndex !== -1) {
        return { columnIndex: i, taskIndex };
      }
    }
    return { columnIndex: -1, taskIndex: -1 };
  };

  const moveTaskBetweenColumns = (
    sourceColumnIndex: number,
    sourceTaskIndex: number,
    targetColumnIndex: number
  ) => {
    const newColumns = [...columnTasks];
    const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(sourceTaskIndex, 1);
    newColumns[targetColumnIndex].tasks.push(movedTask);
    setColumnTasks(newColumns);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (!activeId.startsWith('task-') || !overId.startsWith('column-')) {
      setActiveTask(null);
      return;
    }

    const taskId = activeId.replace('task-', '');
    const targetColumnId = overId.replace('column-', '');

    const { columnIndex: sourceColumnIndex, taskIndex: sourceTaskIndex } = findTaskLocation(taskId);

    if (sourceColumnIndex === -1) {
      setActiveTask(null);
      return;
    }

    const targetColumnIndex = columnTasks.findIndex((col) => col.ItemId === targetColumnId);

    if (targetColumnIndex === -1 || sourceColumnIndex === targetColumnIndex) {
      setActiveTask(null);
      return;
    }

    moveTaskBetweenColumns(sourceColumnIndex, sourceTaskIndex, targetColumnIndex);
    setActiveTask(null);
  };

  const updateTaskCompletion = useCallback(
    async (taskId: string, isCompleted: boolean) => {
      try {
        await updateTask({
          itemId: taskId,
          input: {
            IsCompleted: isCompleted,
          },
        });

        await refetchTasks();
      } catch (error) {
        toast({
          variant: 'destructive',
          title: t('TASK_UPDATE_FAILED'),
          description: t('FAILED_UPDATE_TASK_STATUS'),
        });
        console.error('Error updating task:', error);
      }
    },
    [updateTask, refetchTasks, toast, t]
  );

  const mappedColumns = columnTasks.map((column) => ({
    ...column,
  }));

  return {
    columns: mappedColumns,
    activeColumn,
    activeTask,
    sensors,
    setActiveColumn,
    addColumn: createColumn,
    renameColumn,
    deleteColumn: removeColumn,
    addTask: addTaskToColumn,
    updateTaskStatus: updateTaskCompletion,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    isLoading: isLoadingTasks,
  };
}
