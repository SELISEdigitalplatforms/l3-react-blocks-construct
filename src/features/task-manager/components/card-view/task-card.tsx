import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, MoreVertical } from 'lucide-react';
import { Card } from 'components/ui/card';
import { ITask } from '../../types/task';
import TagBadges from '../tag-badges/tag-badges';
import { PriorityBadge } from '../priority-badge/priority-badge';
import { StatusCircle } from '../status-circle/status-circle';

interface ITaskCardProps {
  task: ITask;
  index: number;
  handleTaskClick: (id: string) => void;
}

export function TaskCard({ task, index, handleTaskClick }: ITaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `task-${task.id}`,
    data: {
      task,
      index,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3">
      <Card className="p-3 cursor-grab bg-white rounded-xl hover:shadow-md border-none">
        <div className="flex justify-between items-start">
          <div className="flex gap-2 flex-grow mr-2">
            <div className="mt-0.5 flex-shrink-0">
              <StatusCircle isCompleted={task.isCompleted} />
            </div>
            <p
              onClick={() => handleTaskClick(task.id)}
              className="text-sm text-gray-700 font-medium cursor-pointer hover:underline"
            >
              {task.content}
            </p>
          </div>
          <div className="flex-shrink-0">
            <MoreVertical className="h-4 w-4 text-gray-400 cursor-pointer" />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {task.priority && <PriorityBadge priority={task.priority} />}
          {task.tags && task.tags.length > 0 && <TagBadges tags={task.tags} />}
        </div>

        {(task.dueDate ||
          (task.assignees && task.assignees.length > 0) ||
          (task.comments ?? 0) > 0 ||
          (task.attachments ?? 0) > 0) && (
          <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(task.dueDate)
                    .toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                    .split('/')
                    .join('/')}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3">
              {task.comments && task.comments > 0 && (
                <span className="flex items-center gap-1">
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
                  <span>{task.comments}</span>
                </span>
              )}

              {task.attachments && task.attachments > 0 && (
                <span className="flex items-center gap-1">
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
                  <span>{task.attachments}</span>
                </span>
              )}
            </div>

            {task.assignees && task.assignees.length > 0 && (
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 3).map((user, idx) => (
                  <div
                    key={idx}
                    className="h-6 w-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs"
                  >
                    {user.charAt(0).toUpperCase()}
                  </div>
                ))}
                {task.assignees.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                    +{task.assignees.length - 3}
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
