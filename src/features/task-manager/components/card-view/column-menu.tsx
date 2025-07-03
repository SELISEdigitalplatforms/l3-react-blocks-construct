import React, { useState, useRef } from 'react';
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { useToast } from 'hooks/use-toast';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';

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
 * @returns {JSX.Element} The column menu component
 *
 * @example
 * // Basic usage
 * <ColumnMenu
 *   columnId="1"
 *   columnTitle="To Do"
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(columnTitle);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  React.useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleRenameSubmit = () => {
    if (newTitle.trim() && newTitle !== columnTitle) {
      onRename(columnId, newTitle);
    }
    setIsRenameDialogOpen(false);
  };

  const handleDeleteClick = () => {
    onDelete(columnId);
    setIsMenuOpen(false);
  };

  const handleConfirm = () => {
    handleDeleteClick();
    setOpen(false);
    toast({
      variant: 'success',
      title: t('COLUMN_DELETED'),
      description: t('COLUMN_HAS_DELETED_SUCCESSFULLY'),
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical
            className="h-5 w-5 text-high-emphasis cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-56">
          <DropdownMenuItem
            className="flex p-3 gap-2.5"
            onClick={() => {
              setIsMenuOpen(false);
              setIsRenameDialogOpen(true);
            }}
          >
            <SquarePen className="h-5 w-5 text-medium-emphasis" />
            <p className="font-normal text-high-emphasis">{t('RENAME_LIST')}</p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex p-3 gap-2.5" onClick={() => setOpen(true)}>
            <Trash2 className="h-5 w-5 text-medium-emphasis" />
            <p className="font-normal text-high-emphasis">{t('DELETE')}</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationModal
        open={open}
        onOpenChange={setOpen}
        title={t('ARE_YOU_SURE')}
        description={t('THIS_WILL_PERMANENTLY_DELETE_THE_TASK')}
        onConfirm={handleConfirm}
      />

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('RENAME_LIST')}</DialogTitle>
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
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="mr-2">
                {t('CANCEL')}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleRenameSubmit}>{t('SAVE')}</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
