import { useState, useCallback, useRef, useEffect } from 'react';
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
import { TaskItem } from '../../features/task-manager/types/task-manager.types';
import {
  NewTaskRow,
  SortableTaskItem,
  StatusCircle,
  TableHeader,
} from 'features/task-manager/components/list-view';
import { Dialog } from 'components/ui/dialog';
import TaskDetailsView from 'features/task-manager/components/task-details-view/task-details-view';
import { useListTasks } from 'features/task-manager/hooks/use-list-tasks';

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
 * @returns {JSX.Element} A drag-and-drop-enabled list of tasks with task creation and modal support
 *
 * @example
 * // Basic usage inside a task manager
 * <TaskListView taskService={new TaskService()} />
 */

export function TaskListView() {
  const { t } = useTranslation();
  const { tasks, createTask, updateTaskOrder, getFilteredTasks } = useListTasks();
  const [statusFilter] = useState<'todo' | 'inprogress' | 'done' | null>(null);
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

  const filteredTasks = getFilteredTasks(statusFilter);
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
            <TableHeader />
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

                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <SortableTaskItem
                      handleTaskClick={handleTaskClick}
                      key={task.ItemId}
                      task={task}
                    />
                  ))
                ) : (
                  <div className="text-center p-8 text-gray-500">{t('NO_TASKS_TO_DISPLAY')}</div>
                )}
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
