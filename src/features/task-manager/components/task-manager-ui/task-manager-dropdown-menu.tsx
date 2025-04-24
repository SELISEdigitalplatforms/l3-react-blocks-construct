import React, { useState } from 'react';
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

  const handleConfirmDelete = () => {
    onDelete();
    setShowConfirm(false);
    toast({
      variant: 'success',
      title: 'Success',
      description: 'Task has been deleted.',
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
                <p className="font-normal text-high-emphasis">Mark as Complete</p>
              </>
            ) : (
              <>
                <CircleDashed className="h-5 w-5 text-medium-emphasis" />
                <p className="font-normal text-high-emphasis">Reopen Task</p>
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex p-3 gap-2.5">
              <MoveHorizontal className="h-5 w-5 text-medium-emphasis" />
              <p className="font-normal text-high-emphasis flex-1">Move to list</p>
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
            <p className="font-normal">Delete</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Are you sure?"
        description="This will permanently delete the task. This action cannot be undone."
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
