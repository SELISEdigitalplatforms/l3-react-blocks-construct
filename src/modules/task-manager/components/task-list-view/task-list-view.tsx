import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import {
  DndContext,
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { ItemTag, TaskItem } from '../../types/task-manager.types';
import { useListTasks } from '../../hooks/use-list-tasks';
import { useGetTaskSections } from '../../hooks/use-task-manager';
import { NewTaskRow, SortableTaskItem, StatusCircle, TaskListHeader } from '../list-view';
import { Dialog } from '@/components/ui-kit/dialog';
import TaskDetailsView from '../task-details-view/task-details-view';

/**
 * TaskListView Component
 *
 * A task list interface that supports drag-and-drop reordering, task creation,
 * and filtering, built using `@dnd-kit/core` for drag behavior and contextual
 * task logic via `useListTasks`.
 *
 * Features:
 * - Drag-and-drop sorting with visual overlays
 * - Task filtering based on status
 * - Inline new task creation
 * - Modal support for task details viewing
 * - Auto-wires "Add Item" button click to open task input row
 *
 * Props:
 * @param {TaskDetails[]} [task] - Optional array of task data (unused in this version, handled by context)
 * @param {TaskService} taskService - Service for interacting with task details and updates
 *
 * @example
 * // Basic usage inside a task manager
 * <TaskListView taskService={new TaskService()} />
 */

interface TaskListViewProps {
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

export function TaskListView({ searchQuery = '', filters }: Readonly<TaskListViewProps>) {
  const { t } = useTranslation();
  const { tasks, createTask, updateTaskOrder, isLoading } = useListTasks();

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task: TaskItem) =>
          task.Title?.toLowerCase().includes(query) ||
          task.Description?.toLowerCase().includes(query) ||
          task.ItemTag?.some(
            (tag: ItemTag) =>
              tag.TagLabel?.toLowerCase().includes(query) ||
              tag.ItemId?.toLowerCase().includes(query)
          )
      );
    }

    if (filters.priorities.length) {
      result = result.filter(
        (task: TaskItem) => task.Priority && filters.priorities.includes(task.Priority)
      );
    }

    if (filters.statuses.length) {
      result = result.filter(
        (task: TaskItem) => task.Section && filters.statuses.includes(task.Section)
      );
    }

    if (filters.assignees.length) {
      result = result.filter((task: TaskItem) =>
        task.Assignee?.some(
          (assignee) => assignee.ItemId && filters.assignees.includes(assignee.ItemId)
        )
      );
    }

    if (filters.tags.length) {
      const tagIds = new Set(filters.tags.map((tag) => tag.ItemId));
      result = result.filter((task: TaskItem) =>
        task.ItemTag?.some((tag) => tagIds.has(tag.ItemId))
      );
    }

    if (filters.dueDate?.from || filters.dueDate?.to) {
      result = result.filter((task: TaskItem) => {
        if (!task.DueDate) return false;
        const dueDate = new Date(task.DueDate);
        if (filters.dueDate?.from && dueDate < filters.dueDate.from) return false;
        if (filters.dueDate?.to && dueDate > filters.dueDate.to) return false;
        return true;
      });
    }

    return result;
  }, [tasks, searchQuery, filters]);

  const { data: sectionsData } = useGetTaskSections({
    pageNo: 1,
    pageSize: 100,
  });

  const columns = useMemo(() => {
    return sectionsData?.TaskManagerSections?.items || [];
  }, [sectionsData]);

  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [showNewTaskInput, setShowNewTaskInput] = useState<boolean>(false);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAddItemClick = () => {
      setShowNewTaskInput(true);
    };

    const addItemButton =
      document.querySelector('button[class*="add-item"]') ||
      document.querySelector('button:has(svg[class*="plus"])') ||
      document.querySelector('button:contains("Add Item")');

    if (addItemButton) {
      addItemButton.addEventListener('click', handleAddItemClick);
    }

    return () => {
      if (addItemButton) {
        addItemButton.removeEventListener('click', handleAddItemClick);
      }
    };
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleAddTask = (title: string, status: string) => {
    if (createTask(title, status)) {
      setShowNewTaskInput(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveTask(tasks.find((task) => `task-${task.ItemId}` === active.id) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIndex = tasks.findIndex((task) => `task-${task.ItemId}` === active.id);
    const overIndex = tasks.findIndex((task) => `task-${task.ItemId}` === over.id);

    if (activeIndex !== overIndex) {
      updateTaskOrder(activeIndex, overIndex);
    }
    setActiveTask(null);
  };

  const taskIds = filteredTasks.map((task) => `task-${task.ItemId}`);

  const handleTaskClick = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailsModalOpen(true);
  }, []);

  return (
    <div className="mt-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto" ref={scrollContainerRef}>
          <div className="min-w-max">
            <TaskListHeader />
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                {showNewTaskInput && (
                  <NewTaskRow onAdd={handleAddTask} onCancel={() => setShowNewTaskInput(false)} />
                )}

                {(() => {
                  if (isLoading) {
                    return (
                      <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                      </div>
                    );
                  }

                  if (filteredTasks.length > 0) {
                    return filteredTasks.map((task) => (
                      <SortableTaskItem
                        handleTaskClick={handleTaskClick}
                        key={task.ItemId}
                        task={task}
                        columns={columns}
                      />
                    ));
                  }

                  return (
                    <div className="text-center p-8 text-gray-500">{t('NO_TASKS_TO_DISPLAY')}</div>
                  );
                })()}
              </SortableContext>

              <DragOverlay>
                {activeTask && (
                  <div className="flex items-center bg-white shadow-lg border border-gray-200 p-4 rounded-lg w-full">
                    <div className="flex-shrink-0 mr-3">
                      <StatusCircle isCompleted={activeTask.IsCompleted} />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-sm text-high-emphasis">{activeTask.Title}</p>
                    </div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </div>
      <Dialog open={isTaskDetailsModalOpen} onOpenChange={setIsTaskDetailsModalOpen}>
        {isTaskDetailsModalOpen && (
          <TaskDetailsView
            taskId={selectedTaskId}
            onClose={() => setIsTaskDetailsModalOpen(false)}
          />
        )}
      </Dialog>
    </div>
  );
}

export default TaskListView;
