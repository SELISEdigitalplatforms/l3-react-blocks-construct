import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MessageSquare, Paperclip } from 'lucide-react';
import { TaskItem } from '../../types/task-manager.types';
import { StatusCircle } from '../status-circle/status-circle';
import { AssigneeAvatars } from './assignee-avatars';
import { useTaskDetails } from '../../hooks/use-task-details';
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
 * @returns {JSX.Element} The sortable task item component
 *
 * @example
 * // Basic usage
 * <SortableTaskItem task={task} handleTaskClick={(id) => console.log('Task clicked:', id)} />
 */

interface SortableTaskItemProps {
  task: TaskItem;
  handleTaskClick: (id: string) => void;
}

export function SortableTaskItem({ task, handleTaskClick }: Readonly<SortableTaskItemProps>) {
  const {
    ItemId: taskId,
    Title: taskTitle,
    IsCompleted: isCompleted,
    Priority: priority,
    DueDate: dueDate,
    Tags: tags = [],
    Assignee: assignee,
    Comments: comments = [],
    Attachments: attachments = [],
    Section: taskSection = '',
  } = task;

  const commentsCount = Array.isArray(comments) ? comments.length : 0;
  const attachmentsCount = Array.isArray(attachments) ? attachments.length : 0;
  const assignees = assignee ? [assignee] : [];

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `task-${taskId}`,
    data: {
      task: {
        id: taskId,
        content: taskTitle,
        isCompleted,
        priority,
        dueDate,
        tags,
        comments: commentsCount,
        attachments: attachmentsCount,
        assignees,
        status: taskSection,
      },
    },
  });

  // Remove unused columns variable to fix lint warning
  const { removeTask, toggleTaskCompletion, updateTaskDetails } = useTaskDetails(taskId);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center min-w-max border-b border-gray-200 hover:bg-surface h-14 ${
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
        <StatusCircle isCompleted={isCompleted} />
      </div>

      <div className="w-64 pl-2 mr-4">
        <button
          onClick={() => handleTaskClick(taskId)}
          className="text-sm text-high-emphasis cursor-pointer hover:underline truncate"
        >
          {taskTitle}
        </button>
      </div>

      <div className="w-32 flex-shrink-0">
        <span className="text-sm text-high-emphasis">{taskSection}</span>
      </div>

      {priority && (
        <div className="w-24 flex-shrink-0 flex items-center">
          <TaskManagerBadge className="px-2 py-0.5" priority={priority}>
            {priority}
          </TaskManagerBadge>
        </div>
      )}

      <div className="w-28 flex-shrink-0">
        {dueDate && (
          <span className="text-sm text-high-emphasis">
            {new Date(dueDate).toLocaleDateString('en-GB', {
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

      <div className="w-32 flex-shrink-0">
        {tags && tags.length > 0 && (
          <TaskManagerBadge className="px-2 py-0.5">{tags[0]}</TaskManagerBadge>
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
            task={task as TaskItem}
            columns={[]}
            onToggleComplete={() => toggleTaskCompletion(!isCompleted)}
            onDelete={removeTask}
            onMoveToColumn={(title: string) => updateTaskDetails({ section: title })}
          />
        </button>
      </div>
    </div>
  );
}
