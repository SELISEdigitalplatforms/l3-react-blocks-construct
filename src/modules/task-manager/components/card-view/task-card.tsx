import { useCallback, useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui-kit/avatar';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar } from 'lucide-react';
import { Card } from '@/components/ui-kit/card';
import { priorityStyle, TaskItem, TaskSection } from '../../types/task-manager.types';
import { StatusCircle } from '../status-circle/status-circle';
import { useTaskDetails } from '../../hooks/use-task-details';
import { useDeleteTaskItem, useGetTaskComments } from '../../hooks/use-task-manager';
import { TaskManagerDropdownMenu } from '../task-manager-ui/task-manager-dropdown-menu';
import { TaskManagerBadge } from '../task-manager-ui/task-manager-badge';
import { useDeviceCapabilities } from '@/modules/file-manager/hooks/use-device-capabilities';

interface ITaskCardProps {
  task: TaskItem;
  index: number;
  columns: TaskSection[];
  handleTaskClick: (taskId: string) => void;
}

/**
 * TaskCard Component
 *
 * A reusable component for rendering a task card in a Kanban-style task manager.
 * This component supports:
 * - Drag-and-drop functionality for reordering tasks
 * - Displaying task details such as title, status, priority, due date, assignees, and tags
 * - Interactive actions like toggling completion, deleting, and moving tasks
 *
 * Features:
 * - Integrates with the `@dnd-kit` library for drag-and-drop functionality
 * - Displays task metadata in a structured layout
 * - Provides a dropdown menu for task actions
 *
 * Props:
 * @param {TaskItem} task - The task object to display
 * @param {number} index - The index of the task in the list
 * @param {TaskSection[]} columns - The list of columns for moving tasks
 * @param {(id: string) => void} handleTaskClick - Callback triggered when the task title is clicked
 *
 * @example
 * // Basic usage
 * <TaskCard task={task} index={0} columns={columns} handleTaskClick={(id) => console.log('Task clicked:', id)} />
 */

interface ITaskCardProps {
  task: TaskItem;
  index: number;
  columns: TaskSection[];
  handleTaskClick: (id: string) => void;
}

export function TaskCard({
  task: initialTask,
  index,
  columns,
  handleTaskClick,
}: Readonly<ITaskCardProps>) {
  const [task, setTask] = useState(initialTask);

  const { data: commentsData } = useGetTaskComments({
    pageNo: 1,
    pageSize: 100,
  });

  const taskComments = useMemo(() => {
    if (!commentsData?.TaskManagerComments?.items) return [];
    return commentsData.TaskManagerComments.items.filter(
      (comment) => comment.TaskId === task.ItemId
    );
  }, [commentsData, task.ItemId]);

  const taskAttachments = task.AttachmentField ?? [];

  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  useEffect(() => {
    const handleTaskUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<TaskItem>;
      if (customEvent.detail?.ItemId === task.ItemId) {
        setTask(customEvent.detail);
      }
    };

    window.addEventListener('task-updated', handleTaskUpdated as EventListener);
    return () => {
      window.removeEventListener('task-updated', handleTaskUpdated as EventListener);
    };
  }, [task.ItemId]);
  const { touchEnabled, screenSize } = useDeviceCapabilities();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `task-${task.ItemId}`,
    data: {
      task,
      index,
      touchEnabled,
      screenSize,
    },
  });

  const { updateTaskDetails } = useTaskDetails(task.ItemId);
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTaskItem();

  const handleDelete = useCallback(() => {
    deleteTask(task.ItemId);
  }, [deleteTask, task.ItemId]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 'auto',
    touchAction: 'none',
  };

  const handleCardClick = useCallback(() => {
    if (!isDragging) {
      handleTaskClick(task.ItemId);
    }
  }, [isDragging, handleTaskClick, task.ItemId]);

  const handleInteractiveElementClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-3 ${touchEnabled ? 'touch-manipulation' : ''}`}
      data-touch-enabled={touchEnabled ? 'true' : 'false'}
      data-screen-size={screenSize}
    >
      <Card
        className={`p-3 ${
          touchEnabled ? 'active:opacity-70' : ''
        } bg-white rounded-lg border hover:shadow-md relative cursor-pointer`}
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex gap-2 flex-grow mr-2">
            <div className="mt-0.5 flex-shrink-0">
              <button
                onClick={(e) => {
                  updateTaskDetails({ IsCompleted: !task.IsCompleted });
                  handleInteractiveElementClick(e);
                }}
                aria-label={task.IsCompleted ? 'Mark task as incomplete' : 'Mark task as complete'}
              >
                <StatusCircle isCompleted={task.IsCompleted} />
              </button>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTaskClick(task.ItemId);
              }}
              className="text-sm text-left text-high-emphasis font-semibold cursor-pointer hover:underline"
            >
              {task.Title}
            </button>
          </div>
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={handleInteractiveElementClick}
            aria-hidden="true"
          >
            <TaskManagerDropdownMenu
              task={task}
              columns={columns.map((column) => ({ id: column.ItemId, title: column.Title }))}
              onToggleComplete={() => updateTaskDetails({ IsCompleted: !task.IsCompleted })}
              onDelete={handleDelete}
              isDeleting={isDeleting}
              onMoveToColumn={(title) => updateTaskDetails({ Section: title })}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {task.Priority && (
            <TaskManagerBadge
              className={`px-2 py-0.5 ${priorityStyle[task.Priority]}`}
              onClick={handleInteractiveElementClick}
              asButton={false}
            >
              {task.Priority}
            </TaskManagerBadge>
          )}

          {task.ItemTag &&
            task.ItemTag.length > 0 &&
            task.ItemTag.map((tag, tagIndex) => (
              <TaskManagerBadge
                className="px-2 py-0.5"
                key={tag.ItemId || `tag-${tag.TagLabel}-${tagIndex}`}
                asButton={false}
                onClick={handleInteractiveElementClick}
              >
                {tag.TagLabel}
              </TaskManagerBadge>
            ))}
        </div>

        {(task.DueDate || task.Assignee) && (
          <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
            {task.DueDate && (
              <button
                className="flex items-center text-medium-emphasis text-xs gap-1"
                onClick={handleInteractiveElementClick}
              >
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(task.DueDate)
                    .toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                    .split('/')
                    .join('/')}
                </span>
              </button>
            )}

            <div className="flex items-center text-medium-emphasis text-xs gap-3">
              {taskComments.length > 0 && (
                <button className="flex items-center gap-1" onClick={handleInteractiveElementClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{taskComments.length}</span>
                </button>
              )}

              {taskAttachments.length > 0 && (
                <button className="flex items-center gap-1" onClick={handleInteractiveElementClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  <span>{taskAttachments.length}</span>
                </button>
              )}
            </div>

            {task.Assignee && task.Assignee.length > 0 && (
              <div className="flex -space-x-2">
                {task.Assignee.slice(0, 3).map((assignee, idx) => {
                  const displayName = assignee?.Name ?? '';
                  const imageUrl = assignee?.ImageUrl;
                  const initial = displayName ? displayName.charAt(0).toUpperCase() : '';
                  const assigneeId = assignee?.ItemId || `assignee-${idx}`;

                  return (
                    <button
                      key={assigneeId}
                      onClick={handleInteractiveElementClick}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleInteractiveElementClick(e as any);
                        }
                      }}
                      className="focus:outline-none rounded-full"
                      aria-label={`View ${displayName || 'assignee'}`}
                      tabIndex={0}
                    >
                      <Avatar className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={imageUrl} alt={displayName} />
                        <AvatarFallback className="bg-neutral-200 text-foreground text-xs">
                          {initial}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  );
                })}
                {task.Assignee.length > 3 && (
                  <div
                    className="h-6 w-6 rounded-full bg-neutral-200 border-2 border-background flex items-center justify-center z-10 relative"
                    style={{ zIndex: 10 }}
                  >
                    <span className="text-[10px] text-medium-emphasis font-medium">
                      +{task.Assignee.length - 3}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
