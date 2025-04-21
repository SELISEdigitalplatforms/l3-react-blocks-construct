import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MessageSquare, MoreVertical, Paperclip } from 'lucide-react';
import { ITask, statusDisplay } from '../../types/task';
import { StatusCircle } from '../status-circle/status-circle';
import { PriorityBadge } from '../priority-badge/priority-badge';
import { AssigneeAvatars } from './assignee-avatars';
import TagBadges from '../tag-badges/tag-badges';

interface SortableTaskItemProps {
  task: ITask;
  handleTaskClick: (id: string) => void;
}

export function SortableTaskItem({ task, handleTaskClick }: SortableTaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `task-${task.id}`,
    data: {
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center min-w-max border-b border-gray-200 hover:bg-gray-50 h-14 ${
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
        <StatusCircle isCompleted={task.isCompleted} />
      </div>

      <div className="w-64 pl-2 mr-4">
        <p
          onClick={() => handleTaskClick(task.id)}
          className="text-sm font-medium text-gray-900 cursor-pointer hover:underline truncate"
        >
          {task.content}
        </p>
      </div>

      <div className="w-24 flex-shrink-0">
        <span className="text-sm text-gray-500">
          {statusDisplay[task.status as keyof typeof statusDisplay] || 'To Do'}
        </span>
      </div>

      <div className="w-24 flex-shrink-0">
        {task.priority && <PriorityBadge priority={task.priority} />}
      </div>

      <div className="w-28 flex-shrink-0">
        {task.dueDate && (
          <span className="text-sm text-gray-500">
            {new Date(task.dueDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </span>
        )}
      </div>

      <div className="w-32 flex-shrink-0">
        <AssigneeAvatars assignees={task.assignees} />
      </div>

      <div className="w-32 flex-shrink-0">
        {task.tags && task.tags.length > 0 && <TagBadges tags={[task.tags[0]]} />}
      </div>

      <div className="flex items-center gap-3 ml-auto pr-4 text-gray-500">
        {task.comments && (
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span className="text-xs">{task.comments}</span>
          </div>
        )}

        {task.attachments && (
          <div className="flex items-center">
            <Paperclip className="h-4 w-4 mr-1" />
            <span className="text-xs">{task.attachments}</span>
          </div>
        )}

        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
