import { useState, useCallback, useEffect } from 'react';
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui-kit/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui-kit/dialog';
import { Input } from '@/components/ui-kit/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui-kit/dropdown-menu';
import { ConfirmationModal } from '@/components/core';
import { useDeleteTaskSection, useUpdateTaskSection } from '../../hooks/use-task-manager';

/**
 * ColumnMenu Component
 *
 * A reusable dropdown menu component for managing column actions in a task manager.
 * This component supports:
 * - Renaming a column
 * - Deleting a column with confirmation
 *
 * Features:
 * - Dropdown menu with options for renaming and deleting columns
 * - Confirmation modal for column deletion
 * - Input dialog for renaming columns
 *
 * Props:
 * @param {string} columnId - The ID of the column being managed
 * @param {string} columnTitle - The current title of the column
 * @param {(columnId: string, newTitle: string) => void} onRename - Callback triggered when the column is renamed
 * @param {(columnId: string) => void} onDelete - Callback triggered when the column is deleted
 *
 * @example
 * // Basic usage
 * <ColumnMenu
 *   columnId="1"
 *   columnTitle="To do"
 *   onRename={(id, title) => console.log('Renamed:', id, title)}
 *   onDelete={(id) => console.log('Deleted:', id)}
 * />
 */

interface ColumnMenuProps {
  columnId: string;
  columnTitle: string;
  onRename: (columnId: string, newTitle: string) => void;
  onDelete: (columnId: string) => void;
}

export function ColumnMenu({
  columnId,
  columnTitle,
  onRename,
  onDelete,
}: Readonly<ColumnMenuProps>) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(columnTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t } = useTranslation();
  const { mutate: updateSection } = useUpdateTaskSection();
  const { mutate: deleteSection } = useDeleteTaskSection();

  const handleRenameSubmit = useCallback(() => {
    if (!newTitle.trim() || newTitle === columnTitle) {
      setIsRenameDialogOpen(false);
      return;
    }

    setIsSubmitting(true);

    updateSection(
      {
        sectionId: columnId,
        input: {
          ItemId: columnId,
          Title: newTitle,
        },
      },
      {
        onSuccess: (data) => {
          if (data?.updateTaskManagerSection?.acknowledged) {
            onRename(columnId, newTitle);
          }
          setIsSubmitting(false);
          setIsRenameDialogOpen(false);
        },
        onError: (error) => {
          const isValidationError = [
            'No records were updated',
            'No response received',
            'Invalid response format',
          ].some((msg) => error.message.includes(msg));

          if (!isValidationError) {
            setNewTitle(columnTitle);
          }
          setIsSubmitting(false);
        },
      }
    );
  }, [columnId, newTitle, columnTitle, onRename, updateSection]);

  const handleDeleteClick = useCallback(() => {
    deleteSection(columnId, {
      onSuccess: () => {
        onDelete(columnId);
        setIsDeleteModalOpen(false);
      },
    });
  }, [columnId, deleteSection, onDelete]);

  useEffect(() => {
    if (isRenameDialogOpen) {
      setNewTitle(columnTitle);
    }
  }, [isRenameDialogOpen, columnTitle]);

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => {
              setIsRenameDialogOpen(true);
            }}
          >
            <SquarePen className="mr-2 h-4 w-4" />
            <span>{t('RENAME_LIST')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>{t('DELETE')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title={t('ARE_YOU_SURE')}
        description={t('THIS_WILL_PERMANENTLY_DELETE_THE_TASK')}
        onConfirm={handleDeleteClick}
        confirmText={t('DELETE')}
      />

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('RENAME_LIST')}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder={t('LIST_TITLE')}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              className="col-span-3"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
              disabled={isSubmitting}
            >
              {t('CANCEL')}
            </Button>
            <Button
              onClick={handleRenameSubmit}
              disabled={isSubmitting || !newTitle.trim() || newTitle === columnTitle}
              className="min-w-20"
            >
              {t('SAVE')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
