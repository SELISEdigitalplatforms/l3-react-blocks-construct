import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import {
  CircleCheckBig,
  CircleDashed,
  MoveHorizontal,
  Trash2,
  EllipsisVertical,
  Check,
} from 'lucide-react';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';
import { useToast } from 'hooks/use-toast';
import { ITask } from 'features/task-manager/types/task';

/**
 * TaskManagerDropdownMenu Component
 *
 * A reusable dropdown menu component for managing task actions.
 * This component supports:
 * - Marking tasks as complete or reopening them
 * - Moving tasks to different columns
 * - Deleting tasks with confirmation
 *
 * Features:
 * - Dropdown menu with submenus for moving tasks
 * - Confirmation modal for task deletion
 * - Toast notifications for successful actions
 *
 * Props:
 * @param {ITask} task - The task object being managed
 * @param {{ id: string; title: string }[]} columns - The list of columns for moving tasks
 * @param {() => void} onToggleComplete - Callback triggered to toggle task completion
 * @param {() => void} onDelete - Callback triggered to delete the task
 * @param {(title: string) => void} onMoveToColumn - Callback triggered to move the task to a specific column
 *
 * @returns {JSX.Element} The task manager dropdown menu component
 *
 * @example
 * // Basic usage
 * <TaskManagerDropdownMenu
 *   task={task}
 *   columns={columns}
 *   onToggleComplete={() => console.log('Task toggled')}
 *   onDelete={() => console.log('Task deleted')}
 *   onMoveToColumn={(column) => console.log('Moved to column:', column)}
 * />
 */

interface TaskDropdownMenuProps {
  task: ITask;
  columns: { id: string; title: string }[];
  onToggleComplete: () => void;
  onDelete: () => void;
  onMoveToColumn: (title: string) => void;
}

export const TaskManagerDropdownMenu = ({
  task,
  columns,
  onToggleComplete,
  onDelete,
  onMoveToColumn,
}: TaskDropdownMenuProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleConfirmDelete = () => {
    onDelete();
    setShowConfirm(false);
    toast({
      variant: 'success',
      title: t('TASK_REMOVED'),
      description: t('TASK_HAS_DELETED_SUCCESSFULLY'),
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="h-5 w-5 text-high-emphasis" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-56">
          <DropdownMenuItem className="flex p-3 gap-2.5" onClick={onToggleComplete}>
            {task.isCompleted ? (
              <>
                <CircleCheckBig className="h-5 w-5 text-primary-400" />
                <p className="font-normal text-high-emphasis">{t('MARK_AS_COMPLETE')}</p>
              </>
            ) : (
              <>
                <CircleDashed className="h-5 w-5 text-medium-emphasis" />
                <p className="font-normal text-high-emphasis">{t('REOPEN_TASK')}</p>
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex p-3 gap-2.5">
              <MoveHorizontal className="h-5 w-5 text-medium-emphasis" />
              <p className="font-normal text-high-emphasis flex-1">{t('MOVE_TO_LIST')}</p>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {columns.map((column) => (
                  <DropdownMenuItem
                    key={column.id}
                    className="flex gap-2.5"
                    onClick={() => onMoveToColumn(column.title)}
                  >
                    {task.status === column.title ? (
                      <Check className="h-5 w-5 text-primary-400" />
                    ) : (
                      <span className="h-4 w-4 inline-block" />
                    )}
                    <span>{column.title}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem
            className="flex p-3 gap-2.5 text-high-emphasis"
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
          >
            <Trash2 className="h-5 w-5" />
            <p className="font-normal">{t('DELETE')}</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={t('ARE_YOU_SURE')}
        description={t('THIS_WILL_PERMANENTLY_DELETE_THE_TASK')}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
