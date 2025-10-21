import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MessageSquare, Paperclip } from 'lucide-react';
import { priorityStyle, TaskItem, TaskSection } from '../../types/task-manager.types';
import { StatusCircle } from '../status-circle/status-circle';
import { AssigneeAvatars } from './assignee-avatars';
import { useTaskDetails } from '../../hooks/use-task-details';
import { useDeleteTaskItem, useGetTaskComments } from '../../hooks/use-task-manager';
import { TaskManagerBadge } from '../task-manager-ui/task-manager-badge';
import { TaskManagerDropdownMenu } from '../task-manager-ui/task-manager-dropdown-menu';

/**
 * SortableTaskItem Component
 *
 * A reusable component for rendering a sortable task item in a list view.
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
 * @param {(id: string) => void} handleTaskClick - Callback triggered when the task title is clicked
 *
 * @example
 * // Basic usage
 * <SortableTaskItem task={task} handleTaskClick={(id) => console.log('Task clicked:', id)} />
 */

interface SortableTaskItemProps {
  task: TaskItem;
  columns: TaskSection[];
  handleTaskClick: (id: string) => void;
}

export function SortableTaskItem({
  task: initialTask,
  columns,
  handleTaskClick,
}: Readonly<SortableTaskItemProps>) {
  const [task, setTask] = useState(initialTask);

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

  const commentsCount = taskComments.length;

  const taskAttachments = task.AttachmentField ?? [];
  const attachmentsCount = taskAttachments.length;
  const assignees = (() => {
    if (!task?.Assignee) return [];
    const assigneeList = Array.isArray(task.Assignee) ? task.Assignee : [task.Assignee];
    return assigneeList
      .map((assignee) => (typeof assignee === 'string' ? assignee : assignee.Name || ''))
      .filter(Boolean);
  })();
  const { updateTaskDetails } = useTaskDetails(task.ItemId);
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTaskItem();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `task-${task.ItemId}`,
    data: {
      task: {
        id: task.ItemId,
        content: task.Title,
        isCompleted: task.IsCompleted,
        priority: task.Priority,
        dueDate: task.DueDate,
        itemTag: task.ItemTag,
        comments: commentsCount,
        attachments: attachmentsCount,
        assignees: assignees,
        status: task.Section,
        tags: task.Tags,
      },
    },
  });

  const handleDelete = useCallback(() => {
    deleteTask(task.ItemId);
  }, [deleteTask, task.ItemId]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center min-w-max border-b border-border hover:bg-surface h-14 ${
        isDragging ? 'bg-blue-50' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="w-12 flex items-center justify-center cursor-grab"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>

      <div className="w-6 flex-shrink-0 flex items-center justify-center">
        <StatusCircle isCompleted={task.IsCompleted} />
      </div>

      <div className="w-72 pl-2 mr-4">
        <button
          onClick={() => handleTaskClick(task.ItemId)}
          className="w-full text-left text-sm text-high-emphasis cursor-pointer hover:underline truncate"
          title={task.Title}
        >
          {task.Title}
        </button>
      </div>

      <div className="w-32 flex-shrink-0">
        <span className="text-sm text-high-emphasis">{task.Section}</span>
      </div>

      {task.Priority && (
        <div className="w-32 flex-shrink-0 flex items-center">
          <TaskManagerBadge className={`px-2 py-0.5 ${priorityStyle[task.Priority]}`}>
            {task.Priority}
          </TaskManagerBadge>
        </div>
      )}

      <div className="w-32 flex-shrink-0">
        {task.DueDate && (
          <span className="text-sm text-high-emphasis">
            {new Date(task.DueDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </span>
        )}
      </div>

      <div className="w-32 flex-shrink-0">
        <AssigneeAvatars assignees={assignees || []} />
      </div>

      <div className="w-28 flex-shrink-0">
        {task.ItemTag && task.ItemTag.length > 0 && (
          <TaskManagerBadge className="px-2 py-0.5">{task.ItemTag[0].TagLabel}</TaskManagerBadge>
        )}
      </div>

      <div className="flex items-center gap-3 ml-auto pr-4 text-high-emphasis text-xs">
        {commentsCount > 0 && (
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span className="text-xs">{commentsCount}</span>
          </div>
        )}

        {attachmentsCount > 0 && (
          <div className="flex items-center">
            <Paperclip className="h-4 w-4 mr-1" />
            <span className="text-xs">{attachmentsCount}</span>
          </div>
        )}

        <button className="p-4 text-medium-emphasis hover:text-high-emphasis">
          <TaskManagerDropdownMenu
            task={task}
            columns={columns.map((column) => ({ id: column.ItemId, title: column.Title }))}
            onToggleComplete={() => updateTaskDetails({ IsCompleted: !task.IsCompleted })}
            onDelete={handleDelete}
            isDeleting={isDeleting}
            onMoveToColumn={(title: string) => updateTaskDetails({ Section: title })}
          />
        </button>
      </div>
    </div>
  );
}
