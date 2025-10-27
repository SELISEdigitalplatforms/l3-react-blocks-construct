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
} from '@/components/ui-kit/dropdown-menu';
import {
  CircleCheckBig,
  CircleDashed,
  MoveHorizontal,
  Trash2,
  EllipsisVertical,
  Check,
} from 'lucide-react';
import { ConfirmationModal } from '@/components/core';
import { TaskItem } from '../../types/task-manager.types';

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
 * @param {TaskItem} task - The task object being managed
 * @param {{ id: string; title: string }[]} columns - The list of columns for moving tasks
 * @param {() => void} onToggleComplete - Callback triggered to toggle task completion
 * @param {() => void} onDelete - Callback triggered to delete the task
 * @param {(title: string) => void} onMoveToColumn - Callback triggered to move the task to a specific column
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
  task: TaskItem;
  columns: { id: string; title: string }[];
  onToggleComplete: () => void;
  onDelete: () => void;
  onMoveToColumn: (title: string) => void;
  isDeleting?: boolean;
}

export const TaskManagerDropdownMenu = ({
  task,
  columns,
  onToggleComplete,
  onDelete,
  onMoveToColumn,
  isDeleting = false,
}: Readonly<TaskDropdownMenuProps>) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useTranslation();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowConfirm(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!isDeleting) {
      setShowConfirm(open);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="h-5 w-5 text-high-emphasis" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-56">
          <DropdownMenuItem className="flex p-3 gap-2.5" onClick={onToggleComplete}>
            {task.IsCompleted ? (
              <>
                <CircleDashed className="h-5 w-5 text-medium-emphasis" />
                <p className="font-normal text-high-emphasis">{t('REOPEN_TASK')}</p>
              </>
            ) : (
              <>
                <CircleCheckBig className="h-5 w-5 text-primary-400" />
                <p className="font-normal text-high-emphasis">{t('MARK_AS_COMPLETE')}</p>
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
                    {task.Section === column.title ? (
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
            className="flex items-center gap-2 text-destructive focus:text-destructive"
            onClick={handleDeleteClick}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            {t('DELETE')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationModal
        open={showConfirm}
        onOpenChange={handleOpenChange}
        title={t('ARE_YOU_SURE')}
        description={t('THIS_WILL_PERMANENTLY_DELETE_THE_TASK')}
        confirmText={t('DELETE')}
        cancelText={t('CANCEL')}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
