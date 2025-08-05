import { useState, useEffect, useCallback } from 'react';
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
import { useDeviceCapabilities } from 'hooks/use-device-capabilities';
import { TaskItem, TaskSection, TaskPriority } from '../types/task-manager.types';
import {
  useGetTasks,
  useGetTaskSections,
  useCreateTaskItem,
  useUpdateTaskItem,
  useCreateTaskSection,
  useUpdateTaskSection,
  useDeleteTaskSection,
} from './use-task-manager';
import { useToast } from 'hooks/use-toast';

interface TaskSectionWithTasks extends TaskSection {
  tasks: TaskItem[];
}

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
  const [columnTasks, setColumnTasks] = useState<TaskSectionWithTasks[]>([]);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const { mutateAsync: createTask } = useCreateTaskItem();
  const { mutateAsync: updateTask } = useUpdateTaskItem();
  const { mutateAsync: createSection } = useCreateTaskSection();
  const { mutateAsync: updateSection } = useUpdateTaskSection();
  const { mutateAsync: deleteSection } = useDeleteTaskSection();

  // Fetch task sections
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
      Comments: task.Comments ?? [],
      Attachments: task.Attachments ?? [],
      CreatedBy: task.CreatedBy ?? '',
      CreatedDate: task.CreatedDate ?? new Date().toISOString(),
      LastUpdatedBy: task.LastUpdatedBy ?? '',
      LastUpdatedDate: task.LastUpdatedDate ?? new Date().toISOString(),
      DueDate: task.DueDate ?? '',
      IsDeleted: task.IsDeleted ?? false,
      Language: task.Language ?? 'en',
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

  // Filter functions
  const hasMatchingTagLabel = useCallback(
    (tags: TaskItem['ItemTag'], searchTerm: string): boolean => {
      if (!tags?.length) return false;
      return tags.some((tag: { TagLabel: string }) =>
        tag.TagLabel.toLowerCase().includes(searchTerm)
      );
    },
    []
  );

  const matchesSearchQuery = useCallback(
    (task: TaskItem, query: string): boolean => {
      if (!query) return true;

      const searchTerm = query.toLowerCase();
      const lowerTitle = task.Title?.toLowerCase() || '';
      const lowerDescription = task.Description?.toLowerCase() ?? '';

      return (
        lowerTitle.includes(searchTerm) ||
        lowerDescription.includes(searchTerm) ||
        hasMatchingTagLabel(task.ItemTag, searchTerm)
      );
    },
    [hasMatchingTagLabel]
  );

  const matchesPriority = useCallback((task: TaskItem, priorities: string[]): boolean => {
    return !priorities.length || !task.Priority || priorities.includes(task.Priority);
  }, []);

  const hasMatchingAssignee = useCallback(
    (assignee: { ItemId?: string }, assignees: string[]): boolean => {
      return Boolean(assignee.ItemId && assignees.includes(assignee.ItemId));
    },
    []
  );

  const matchesAssignees = useCallback(
    (task: TaskItem, assignees: string[]): boolean => {
      if (!assignees.length || !task.Assignee?.length) return true;
      return task.Assignee.some((assignee) => hasMatchingAssignee(assignee, assignees));
    },
    [hasMatchingAssignee]
  );

  const hasMatchingTagId = useCallback((tag: { ItemId: string }, tagIds: string[]): boolean => {
    return tagIds.includes(tag.ItemId);
  }, []);

  const matchesTags = useCallback(
    (task: TaskItem, tags: any[]): boolean => {
      if (!tags.length || !task.ItemTag?.length) return true;
      const tagIds = tags.map((t) => t.ItemId);
      return task.ItemTag.some((tag) => tag.ItemId && hasMatchingTagId(tag, tagIds));
    },
    [hasMatchingTagId]
  );

  const matchesDueDate = useCallback((task: TaskItem, dueDate: any): boolean => {
    if ((!dueDate?.from && !dueDate?.to) || !task.DueDate) return true;
    const taskDueDate = new Date(task.DueDate);
    const afterStart = !dueDate.from || taskDueDate >= dueDate.from;
    const beforeEnd = !dueDate.to || taskDueDate <= dueDate.to;
    return afterStart && beforeEnd;
  }, []);

  const processTasks = useCallback(
    (
      tasks: TaskItem[],
      filteredSections: TaskSection[],
      currentFilters: any,
      searchQuery: string
    ) => {
      const sectionsByTitle = new Map<string, TaskSection>();
      filteredSections.forEach((section: TaskSection) => {
        if (section.Title) {
          sectionsByTitle.set(section.Title, section);
        }
      });

      const tasksBySectionId: Record<string, TaskItem[]> = {};
      filteredSections.forEach((section: TaskSection) => {
        tasksBySectionId[section.ItemId] = [];
      });

      const getSectionByTitle = (title: string): TaskSection | undefined => {
        return Array.from(sectionsByTitle.values()).find((s) => s.Title === title);
      };

      const ensureSectionExists = (sectionId: string) => {
        if (!tasksBySectionId[sectionId]) {
          tasksBySectionId[sectionId] = [];
        }
      };

      const addTaskToSection = (task: TaskItem) => {
        if (!task.Section) return;

        const section = getSectionByTitle(task.Section);
        if (!section) return;

        ensureSectionExists(section.ItemId);
        tasksBySectionId[section.ItemId].push(ensureTaskItem(task));
      };

      tasks.forEach((task: TaskItem) => {
        if (!matchesSearchQuery(task, searchQuery)) return;
        if (!matchesPriority(task, currentFilters.priorities)) return;
        if (!matchesAssignees(task, currentFilters.assignees)) return;
        if (!matchesTags(task, currentFilters.tags)) return;
        if (!matchesDueDate(task, currentFilters.dueDate)) return;

        addTaskToSection(task);
      });

      return filteredSections.map((section: TaskSection) => ({
        ...section,
        tasks: tasksBySectionId[section.ItemId] || [],
      }));
    },
    [
      ensureTaskItem,
      matchesSearchQuery,
      matchesPriority,
      matchesAssignees,
      matchesTags,
      matchesDueDate,
    ]
  );

  const getFilteredSections = useCallback((sections: TaskSection[], statuses: string[]) => {
    return sections.filter(
      (section: TaskSection) =>
        !statuses.length || (section.Title && statuses.includes(section.Title))
    );
  }, []);

  const getEmptySections = useCallback((sections: TaskSection[]) => {
    return sections.map((section: TaskSection) => ({
      ...section,
      tasks: [],
    }));
  }, []);

  useEffect(() => {
    if (!sectionsData?.TaskManagerSections?.items) return;

    const currentFilters = {
      priorities: filters.priorities ?? [],
      statuses: filters.statuses ?? [],
      assignees: filters.assignees ?? [],
      tags: filters.tags ?? [],
      dueDate: filters.dueDate ?? {},
    };

    const filteredSections = getFilteredSections(
      sectionsData.TaskManagerSections.items,
      currentFilters.statuses
    );

    const updateTasks = () => {
      if (!tasksData?.TaskManagerItems?.items) {
        return getEmptySections(filteredSections);
      }

      return processTasks(
        tasksData.TaskManagerItems.items,
        filteredSections,
        currentFilters,
        searchQuery
      );
    };

    setColumnTasks(updateTasks);
  }, [
    sectionsData,
    tasksData,
    searchQuery,
    filters.priorities,
    filters.statuses,
    filters.assignees,
    filters.tags,
    filters.dueDate,
    processTasks,
    getFilteredSections,
    getEmptySections,
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
          title: 'Error updating section',
          description: 'Failed to update the section. Please try again.',
          variant: 'destructive',
        });
        console.error('Error updating section:', error);
      }
    },
    [updateSection, toast]
  );

  const removeColumn = useCallback(
    async (columnId: string) => {
      try {
        await deleteSection(columnId);
        setColumnTasks((prev) => prev.filter((column) => column.ItemId !== columnId));
      } catch (error) {
        toast({
          title: 'Error deleting section',
          description: 'Failed to delete the section. Please try again.',
          variant: 'destructive',
        });
        console.error('Error deleting section:', error);
      }
    },
    [deleteSection, toast]
  );

  const createTempTask = useCallback(
    (content: string, sectionTitle: string): TaskItem => ({
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
      IsDeleted: false,
    }),
    []
  );

  const createTaskData = useCallback(
    (content: string, sectionTitle: string) => ({
      Title: content,
      Description: '',
      Section: sectionTitle,
      IsCompleted: false,
      Language: 'en',
      OrganizationIds: [],
      Priority: TaskPriority.MEDIUM,
      ItemTag: [],
    }),
    []
  );

  const removeTempTask = useCallback(
    (prev: TaskSectionWithTasks[], columnId: string, tempTaskId: string) =>
      prev.map((column) =>
        column.ItemId === columnId
          ? {
              ...column,
              tasks: column.tasks.filter((t) => t.ItemId !== tempTaskId),
            }
          : column
      ),
    []
  );

  const updateTaskId = useCallback(
    (prev: TaskSectionWithTasks[], columnId: string, tempTaskId: string, newTaskId: string) =>
      prev.map((column) =>
        column.ItemId === columnId
          ? {
              ...column,
              tasks: column.tasks.map((t) =>
                t.ItemId === tempTaskId ? { ...t, ItemId: newTaskId } : t
              ),
            }
          : column
      ),
    []
  );

  const validateSection = useCallback(
    (columnId: string) => {
      const section = columnTasks.find((col: TaskSection) => col.ItemId === columnId);
      if (!section) {
        const errorMessage = `Section not found for column ${columnId}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      if (!section.Title) {
        throw new Error(`Section title is empty for column ${columnId}`);
      }

      return section;
    },
    [columnTasks]
  );

  const addTempTask = useCallback((columnId: string, task: TaskItem) => {
    setColumnTasks((prev) =>
      prev.map((column) =>
        column.ItemId === columnId ? { ...column, tasks: [...column.tasks, task] } : column
      )
    );
  }, []);

  const handleTaskCreationError = useCallback(
    (error: unknown, columnId: string, tempTaskId: string) => {
      console.error('Error in createTask mutation:', error);
      setColumnTasks((prev) => removeTempTask(prev, columnId, tempTaskId));
      throw new Error(
        error instanceof Error ? error.message : 'Failed to create task on the server'
      );
    },
    [removeTempTask]
  );

  const addTaskToColumn = useCallback(
    async (columnId: string, content: string): Promise<string | null> => {
      if (!content.trim()) return null;

      try {
        const section = validateSection(columnId);
        const sectionTitle = section.Title;
        const tempTask = createTempTask(content, sectionTitle);

        addTempTask(columnId, tempTask);

        try {
          const taskData = createTaskData(content, sectionTitle);
          const response = await createTask(taskData);
          const taskId = response?.insertTaskManagerItem?.itemId;

          if (!taskId) {
            throw new Error('Failed to create task: No task ID returned from server');
          }

          setColumnTasks((prev) => updateTaskId(prev, columnId, tempTask.ItemId, taskId));
          await refetchTasks();
          return taskId;
        } catch (error) {
          return handleTaskCreationError(error, columnId, tempTask.ItemId);
        }
      } catch (error) {
        console.error('Error in addTaskToColumn:', error);
        toast({
          title: 'Error creating task',
          description:
            error instanceof Error ? error.message : 'Failed to create the task. Please try again.',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [
      createTask,
      toast,
      refetchTasks,
      validateSection,
      createTempTask,
      addTempTask,
      createTaskData,
      updateTaskId,
      handleTaskCreationError,
    ]
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

      const newColumns = JSON.parse(JSON.stringify(columnTasks));
      const sourceTasks = [...newColumns[sourceColumnIndex].tasks];
      const activeTaskIndex = sourceTasks.findIndex((task) => task.ItemId === activeTaskId);

      if (activeTaskIndex === -1) return;

      const [movedTask] = sourceTasks.splice(activeTaskIndex, 1);
      if (!movedTask) return;

      const targetSectionTitle = newColumns[targetColumnIndex].Title;

      try {
        await updateTask({
          itemId: movedTask.ItemId,
          input: {
            Section: targetSectionTitle,
          },
        });

        const targetTasks = [...(newColumns[targetColumnIndex].tasks || [])];
        const existingTaskIndex = targetTasks.findIndex((task) => task.ItemId === movedTask.ItemId);
        if (existingTaskIndex !== -1) {
          targetTasks.splice(existingTaskIndex, 1);
        }

        const updatedTask = {
          ...movedTask,
          Section: targetSectionTitle,
        };

        targetTasks.push(updatedTask);

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
        console.error('Error moving task to column:', error);
        toast({
          title: 'Error moving task',
          description: 'Failed to move the task. Please try again.',
          variant: 'destructive',
        });
        refetchTasks();
      }
    },
    [columnTasks, updateTask, toast, refetchTasks]
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

      const [movedTask] = sourceTasks.splice(sourceTaskIndex, 1);
      if (!movedTask) return;

      const targetSectionTitle = newColumns[targetColumnIndex].Title;

      try {
        await updateTask({
          itemId: movedTask.ItemId,
          input: {
            Section: targetSectionTitle,
          },
        });

        const targetTasks = [...(newColumns[targetColumnIndex].tasks || [])];
        const existingTaskIndex = targetTasks.findIndex((task) => task.ItemId === movedTask.ItemId);
        if (existingTaskIndex !== -1) {
          targetTasks.splice(existingTaskIndex, 1);
        }

        // Find the position to insert the task
        const overTaskIndex = targetTasks.findIndex((task) => task.ItemId === overTaskId);
        const insertIndex = overTaskIndex !== -1 ? overTaskIndex : targetTasks.length;

        const updatedTask = {
          ...movedTask,
          Section: targetSectionTitle,
        };

        targetTasks.splice(insertIndex, 0, updatedTask);

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
        console.error('Error moving task:', error);
        toast({
          title: 'Error moving task',
          description: 'Failed to move the task. Please try again.',
          variant: 'destructive',
        });
        refetchTasks();
      }
    },
    [columnTasks, updateTask, toast, refetchTasks]
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
          title: 'Error updating task',
          description: 'Failed to update the task status. Please try again.',
          variant: 'destructive',
        });
        console.error('Error updating task:', error);
      }
    },
    [updateTask, refetchTasks, toast]
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
