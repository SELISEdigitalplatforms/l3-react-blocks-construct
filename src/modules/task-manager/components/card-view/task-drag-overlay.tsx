import { Card } from '@/components/ui-kit/card';
import { ItemTag, TaskItem, priorityStyle } from '../../types/task-manager.types';
import { StatusCircle } from '../status-circle/status-circle';
import { TaskManagerBadge } from '../task-manager-ui/task-manager-badge';

/**
 * TaskDragOverlay Component
 *
 * A reusable component for rendering a visual overlay during drag-and-drop operations for tasks.
 * This component supports:
 * - Displaying the task's content, priority, and tags
 * - Providing a compact and visually appealing drag preview
 *
 * Features:
 * - Displays task metadata such as status, priority, and tags
 * - Provides a semi-transparent overlay for better drag-and-drop UX
 * - Dynamically adjusts based on the active task being dragged
 *
 * Props:
 * @param {TaskItem | null} activeTask - The task object currently being dragged, or null if no task is active
 *
 * @returns {JSX.Element | null} The drag overlay component when a task is active, or null otherwise
 *
 * @example
 * // Basic usage
 * <TaskDragOverlay activeTask={task} />
 */

interface TaskDragOverlayProps {
  activeTask: TaskItem | null;
}

export function TaskDragOverlay({ activeTask }: Readonly<TaskDragOverlayProps>) {
  if (!activeTask) return null;

  return (
    <Card className="p-3 bg-white shadow-lg w-72 opacity-90">
      <div className="flex gap-2 items-start">
        <div className="mt-0.5 flex-shrink-0">
          <StatusCircle isCompleted={activeTask.IsCompleted ?? false} />
        </div>
        <p className="text-sm text-high-emphasis font-medium">{activeTask.Title || ''}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {activeTask.Priority && (
          <TaskManagerBadge className={`px-2 py-0.5 ${priorityStyle[activeTask.Priority]}`}>
            {activeTask.Priority}
          </TaskManagerBadge>
        )}
        {activeTask.ItemTag?.map((tag: ItemTag) => (
          <TaskManagerBadge key={tag.ItemId} className="px-2 py-0.5">
            {tag.TagLabel}
          </TaskManagerBadge>
        ))}
      </div>
    </Card>
  );
}
