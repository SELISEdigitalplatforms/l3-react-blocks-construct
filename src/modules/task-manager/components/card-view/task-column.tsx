import React, { useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui-kit/button';
import { Input } from '@/components/ui-kit/input';
import { TaskCard } from './task-card';
import { Dialog } from '@/components/ui-kit/dialog';
import TaskDetailsView from '../task-details-view/task-details-view';
import { ColumnMenu } from './column-menu';
import { getResponsiveContainerHeight } from '@/lib/mobile-responsiveness';
import { TaskSection } from '../../types/task-manager.types';
import { useDeviceCapabilities } from '@/modules/file-manager/hooks/use-device-capabilities';

/**
 * TaskColumn Component
 *
 * A reusable component for rendering a task column in a Kanban-style task manager.
 * This component supports:
 * - Displaying tasks within a column
 * - Adding new tasks to the column
 * - Drag-and-drop functionality for reordering tasks
 * - Managing column actions such as renaming and deleting
 *
 * Features:
 * - Integrates with the `@dnd-kit` library for drag-and-drop functionality
 * - Displays tasks in a scrollable container
 * - Provides input for adding new tasks
 * - Includes a dropdown menu for column actions
 *
 * Props:
 * @param {ITaskColumnProps} column - The column object containing its ID, title, and tasks
 * @param {Function} setActiveColumn - Callback to set the active column
 * @param {Function} onAddTask - Callback triggered when a new task is added
 * @param {Function} onRenameColumn - Callback triggered when the column is renamed
 * @param {Function} onDeleteColumn - Callback triggered when the column is deleted
 * @param {Function} [onTaskAdded] - Optional callback triggered when a task is added
 * @param {TaskService} taskService - Service for managing task-related operations
 * @param {boolean} [isNewColumn] - Whether the column is newly created
 *
 * @example
 * // Basic usage
 * <TaskColumn
 *   column={column}
 *   tasks={tasks}
 *   setActiveColumn={(id) => console.log('Active column:', id)}
 *   onAddTask={(columnId, title) => console.log('Task added:', columnId, title)}
 *   onRenameColumn={(id, title) => console.log('Column renamed:', id, title)}
 *   onDeleteColumn={(id) => console.log('Column deleted:', id)}
 *   taskService={taskServiceInstance}
 * />
 */

export interface TaskColumnProps {
  column: TaskSection;
  tasks: any[];
  sections: TaskSection[];
  setActiveColumn: (columnId: string | null) => void;
  onAddTask: (columnId: string, taskTitle: string) => Promise<string | null>;
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onTaskAdded?: () => void;
  isNewColumn?: boolean;
}

export function TaskColumn({
  column,
  tasks,
  sections,
  onAddTask,
  onRenameColumn,
  onDeleteColumn,
  onTaskAdded,
  isNewColumn,
}: Readonly<TaskColumnProps>) {
  const { touchEnabled, screenSize } = useDeviceCapabilities();
  const { t } = useTranslation();

  const { isOver, setNodeRef } = useDroppable({
    id: `column-${column.ItemId}`,
    data: {
      column,
      touchEnabled,
      screenSize,
    },
  });

  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [showAddInput, setShowAddInput] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLDivElement>(null);

  const MIN_COLUMN_HEIGHT = '150px';

  const taskIds = useMemo(
    () =>
      tasks.map((task, index) => `task-${(task && (task.ItemId || task.id)) || `temp-${index}`}`),
    [tasks]
  );

  const handleAddTaskClick = () => {
    if (showAddInput) return;
    setShowAddInput(true);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || isAddingTask) return;

    setIsAddingTask(true);
    try {
      const taskId = await onAddTask(column.ItemId, newTaskTitle);

      if (taskId) {
        setNewTaskTitle('');
        setShowAddInput(false);

        if (onTaskAdded) {
          onTaskAdded();
        }

        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleAddTask();
    } else if (e.key === 'Escape') {
      setShowAddInput(false);
      setNewTaskTitle('');
    }
  };

  const handleCancelAddTask = () => {
    setShowAddInput(false);
    setNewTaskTitle('');
  };

  const handleTaskClick = (id: string) => {
    setSelectedTaskId(id);
    setIsTaskDetailsModalOpen(true);
  };

  const getColumnHeight = () => {
    if (isNewColumn && tasks.length === 0) {
      return MIN_COLUMN_HEIGHT;
    }
    if (touchEnabled) {
      return tasks.length === 0 ? MIN_COLUMN_HEIGHT : 'auto';
    }
    return 'auto';
  };

  return (
    <div className="w-80 shrink-0 flex flex-col">
      <div className="flex justify-between items-center mb-3 px-1">
        <div className="flex items-center gap-3">
          <h2 className="text-high-emphasis text-base font-bold">{column.Title}</h2>
          <span className="text-sm text-medium-emphasis font-semibold">{tasks.length}</span>
        </div>
        <ColumnMenu
          columnId={column.ItemId}
          columnTitle={column.Title}
          onRename={onRenameColumn}
          onDelete={onDeleteColumn}
        />
      </div>
      <div
        ref={setNodeRef}
        className={`bg-neutral-25 p-3 border shadow-sm rounded-lg flex flex-col ${
          isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''
        } ${touchEnabled ? 'touch-manipulation' : ''}`}
        style={{
          height: getColumnHeight(),
          minHeight: isNewColumn && tasks.length === 0 ? MIN_COLUMN_HEIGHT : 'auto',
          touchAction: 'none',
        }}
        data-touch-enabled={touchEnabled ? 'true' : 'false'}
        data-screen-size={screenSize}
      >
        <div
          ref={scrollContainerRef}
          className="flex flex-col overflow-y-auto mb-2 flex-grow"
          style={{
            maxHeight: getResponsiveContainerHeight({
              isEmpty: tasks.length === 0,
              isMobile: screenSize === 'mobile',
            }),
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E0 transparent',
            touchAction: 'pan-y',
          }}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={task.ItemId || task.id || `task-temp-${column.ItemId}-${index}`}
                  className="task-card-container"
                >
                  <TaskCard
                    handleTaskClick={handleTaskClick}
                    task={task}
                    index={index}
                    columns={sections}
                  />
                </div>
              ))}
            </div>
          </SortableContext>

          {tasks.length === 0 && !showAddInput && (
            <div className="text-center py-8">
              <p className="text-sm text-medium-emphasis">{t('NO_TASKS_IN_THIS_LIST')}</p>
            </div>
          )}
        </div>

        <div ref={addButtonRef}>
          {showAddInput ? (
            <div className="space-y-2 py-2">
              <Input
                placeholder={t('ENTER_TASK_TITLE')}
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full bg-white border-0 focus:ring-0 text-sm px-2"
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleAddTask}
                  className="min-w-20"
                  disabled={isAddingTask}
                >
                  <Plus className="h-4 w-4" />
                  {t('ADD')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelAddTask}
                  className="p-0 h-8 w-8 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-medium-emphasis text-sm justify-center hover:text-high-emphasis bg-white rounded-md font-bold mt-auto"
              onClick={handleAddTaskClick}
            >
              <Plus className="h-4 w-4 mr-1" /> {t('ADD_ITEM')}
            </Button>
          )}
        </div>
      </div>
      <Dialog open={isTaskDetailsModalOpen} onOpenChange={setIsTaskDetailsModalOpen}>
        {isTaskDetailsModalOpen && (
          <TaskDetailsView
            taskId={selectedTaskId}
            onClose={() => setIsTaskDetailsModalOpen(false)}
            onTaskAddedList={onTaskAdded}
          />
        )}
      </Dialog>
    </div>
  );
}
