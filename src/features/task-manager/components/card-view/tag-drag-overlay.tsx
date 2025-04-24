import { Card } from 'components/ui/card';
import { ITask, TPriority } from '../../types/task';
import { StatusCircle } from '../status-circle/status-circle';
import { TaskManagerBadge } from '../task-manager-ui/task-manager-badge';

interface TaskDragOverlayProps {
  activeTask: ITask | null;
}

export function TaskDragOverlay({ activeTask }: TaskDragOverlayProps) {
  if (!activeTask) return null;

  return (
    <Card className="p-3 bg-white shadow-lg w-72 opacity-90">
      <div className="flex gap-2 items-start">
        <div className="mt-0.5 flex-shrink-0">
          <StatusCircle isCompleted={activeTask.isCompleted} />
        </div>
        <p className="text-sm text-high-emphasis font-medium">{activeTask.content}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {activeTask.priority && (
          <TaskManagerBadge priority={activeTask.priority as TPriority} className="px-2 py-0.5">
            {activeTask.priority}
          </TaskManagerBadge>
        )}
        {activeTask.tags &&
          activeTask.tags.length > 0 &&
          activeTask.tags.map((tag, index) => (
            <TaskManagerBadge key={index} className="px-2 py-0.5">
              {tag}
            </TaskManagerBadge>
          ))}
      </div>
    </Card>
  );
}
