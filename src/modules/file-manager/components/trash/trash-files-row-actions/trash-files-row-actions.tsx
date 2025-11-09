import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, MoreVertical, RotateCcw, Trash2 } from 'lucide-react';
import { Row } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui-kit/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui-kit/alert-dialog';
import { Button } from '@/components/ui-kit/button';
import { IFileTrashData } from '@/modules/file-manager/utils/file-manager';

interface TrashTableRowActionsProps {
  row: Row<IFileTrashData>;
  onRestore: (file: IFileTrashData) => void;
  onDelete: (file: IFileTrashData) => void;
  onPermanentDelete?: (file: IFileTrashData) => void;
  onViewDetails?: (file: IFileTrashData) => void;
}

export const TrashTableRowActions = ({
  row,
  onRestore,
  onDelete,
  onPermanentDelete,
  onViewDetails,
}: Readonly<TrashTableRowActionsProps>) => {
  const { t } = useTranslation();
  const file = row.original;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteForeverDialogOpen, setIsDeleteForeverDialogOpen] = useState(false);

  const handleItemClick = (action: (file: IFileTrashData) => void) => {
    setIsDropdownOpen(false);
    setTimeout(() => {
      action(file);
    }, 100);
  };

  const handleViewDetailsClick = () => {
    if (onViewDetails) {
      handleItemClick(onViewDetails);
    }
  };

  const handleDropdownTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleDropdownOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
  };

  const handleDropdownContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDeleteForeverClick = () => {
    setIsDeleteForeverDialogOpen(true);
  };

  const handleDeleteForeverConfirm = () => {
    // For mock data, this will immediately "delete" the item
    if (onPermanentDelete) {
      onPermanentDelete(file);
    } else if (onDelete) {
      onDelete(file);
    }
    setIsDeleteForeverDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={handleDropdownTriggerClick}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48"
          onClick={handleDropdownContentClick}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuItem onClick={() => handleItemClick(handleViewDetailsClick)}>
            <Info className="mr-2 h-4 w-4" />
            {t('VIEW_DETAILS')}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleItemClick(onRestore)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t('RESTORE')}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDeleteForeverClick}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('DELETE_FOREVER')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteForeverDialogOpen} onOpenChange={setIsDeleteForeverDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('DELETE_FOREVER_TITLE')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('DELETE_FOREVER_DESCRIPTION', { fileName: `"${file.name}"` })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('CANCEL')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteForeverConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('CONFIRM')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
