import React, { useState } from 'react';
import { Row } from '@tanstack/react-table';
import {
  MoreVertical,
  Download,
  UserPlus,
  Trash2,
  Info,
  PencilLine,
  Copy,
  ExternalLink,
  Move,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui-kit/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui-kit/dropdown-menu';
import { IFileData } from '../../types/file-manager.type';

interface FileTableRowActionsProps {
  row: Row<IFileData>;
  onViewDetails: (file: IFileData) => void;
  onDownload?: (file: IFileData) => void;
  onShare?: (file: IFileData) => void;
  onDelete?: (file: IFileData) => void;
  onCopy?: (file: IFileData) => void;
  onMove?: (file: IFileData) => void;
  onOpen?: (file: IFileData) => void;
  onRename?: (file: IFileData) => void;
}

export const FileTableRowActions = ({
  row,
  onViewDetails,
  onDownload,
  onShare,
  onDelete,
  onMove,
  onCopy,
  onOpen,
  onRename,
}: Readonly<FileTableRowActionsProps>) => {
  const { t } = useTranslation();
  const file = row.original;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleItemClick = (action: (file: IFileData) => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDropdownOpen(false);
    setTimeout(() => {
      action(file);
    }, 0);
  };

  const handleDropdownTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleDropdownTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      setIsDropdownOpen((prev) => !prev);
    }
  };

  const handleDropdownOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
  };

  const handleDropdownContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDropdownContentKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const canDownload = onDownload !== undefined;
  const canDelete = onDelete !== undefined;
  const canShare = onShare !== undefined;
  const canRename = onRename !== undefined;
  const canCopy = onCopy !== undefined;
  const canOpen = onOpen !== undefined;
  const canMove = onMove !== undefined;

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={handleDropdownTriggerClick}
          onKeyDown={handleDropdownTriggerKeyDown}
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
        onKeyDown={handleDropdownContentKeyDown}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {canOpen && (
          <DropdownMenuItem onClick={handleItemClick(onOpen)}>
            <ExternalLink className="mr-2 h-4 w-4" />
            {t('OPEN')}
          </DropdownMenuItem>
        )}

        {canShare && (
          <DropdownMenuItem onClick={handleItemClick(onShare)}>
            <UserPlus className="mr-2 h-4 w-4" />
            {t('SHARE')}
          </DropdownMenuItem>
        )}

        {canCopy && (
          <DropdownMenuItem onClick={handleItemClick(onCopy)}>
            <Copy className="mr-2 h-4 w-4" />
            {t('COPY')}
          </DropdownMenuItem>
        )}
        {canMove && (
          <DropdownMenuItem onClick={handleItemClick(onMove)}>
            <Move className="mr-2 h-4 w-4" />
            {t('MOVE')}
          </DropdownMenuItem>
        )}

        {canRename && (
          <DropdownMenuItem onClick={handleItemClick(onRename)}>
            <PencilLine className="mr-2 h-4 w-4" />
            {t('RENAME')}
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleItemClick(onViewDetails)}>
          <Info className="mr-2 h-4 w-4" />
          {t('VIEW_DETAILS')}
        </DropdownMenuItem>

        {canDownload && (
          <DropdownMenuItem onClick={handleItemClick(onDownload)}>
            <Download className="mr-2 h-4 w-4" />
            {t('DOWNLOAD')}
          </DropdownMenuItem>
        )}

        {canDelete && (
          <DropdownMenuItem
            onClick={handleItemClick(onDelete)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('REMOVE')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
