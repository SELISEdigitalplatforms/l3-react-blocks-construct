import { Card } from 'components/ui/card';
import { ITask } from '../../types/task';
import TagBadges from '../tag-badges/tag-badges';
import { PriorityBadge } from '../priority-badge/priority-badge';
import { StatusCircle } from '../status-circle/status-circle';

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
        <p className="text-sm text-gray-800 font-medium">{activeTask.content}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {activeTask.priority && <PriorityBadge priority={activeTask.priority} />}
        {activeTask.tags && activeTask.tags.length > 0 && <TagBadges tags={activeTask.tags} />}
      </div>
    </Card>
  );
}
