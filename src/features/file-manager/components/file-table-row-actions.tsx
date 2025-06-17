import React, { useState } from 'react';
import { Row } from '@tanstack/react-table';
import {
  MoreVertical,
  Download,
  Users,
  Trash2,
  Info,
  Edit,
  FolderOpen,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';

import { Dialog } from 'components/ui/dialog';
import { IFileData } from '../hooks/use-mock-files-query';

/**
 * Renders the actions for a row in the File Management table.
 *
 * This component provides a dropdown menu with actions that can be performed on a file or folder,
 * such as viewing details, downloading, sharing, editing properties, copying, moving, or deleting.
 *
 * Features:
 * - Displays a dropdown with context-sensitive actions based on the file type
 * - Allows opening files/folders and editing file properties
 * - Supports download, share, copy, move, and delete operations
 * - Different actions available for folders vs files
 * - Prevents certain actions on shared files based on permissions
 *
 * @param {DataTableRowActionsProps} props - The props for configuring the row actions
 * @param {Row<IFileData>} props.row - The row data for the file, containing file information
 * @param {function} props.onViewDetails - Callback function triggered when the "View Details" action is clicked
 * @param {function} props.onDownload - Callback function triggered when the "Download" action is clicked
 * @param {function} [props.onShare] - Optional callback function triggered when the "Share" action is clicked
 * @param {function} [props.onDelete] - Optional callback function triggered when the "Delete" action is clicked
 * @param {function} [props.onCopy] - Optional callback function triggered when the "Copy" action is clicked
 * @param {function} [props.onMove] - Optional callback function triggered when the "Move" action is clicked
 * @param {function} [props.onOpen] - Optional callback function triggered when the "Open" action is clicked
 *
 * @returns {JSX.Element} - The rendered row actions dropdown and the edit modal if opened
 *
 * @example
 * <DataTableRowActions
 *   row={fileRow}
 *   onViewDetails={(file) => console.log('Viewing details for:', file)}
 *   onDownload={(file) => console.log('Downloading:', file)}
 *   onShare={(file) => console.log('Sharing:', file)}
 *   onDelete={(file) => console.log('Deleting:', file)}
 * />
 */

interface FileTableRowActionsProps {
  row: Row<IFileData>;
  onViewDetails: (file: IFileData) => void;
  onDownload: (file: IFileData) => void;
  onShare?: (file: IFileData) => void;
  onDelete?: (file: IFileData) => void;
  onCopy?: (file: IFileData) => void;
  onMove?: (file: IFileData) => void;
  onOpen?: (file: IFileData) => void;
  onRename?: (file: IFileData) => void; // Added rename function
}

export function FileTableRowActions({
  row,
  onViewDetails,
  onDownload,
  onShare,
  onDelete,
  onCopy,
  onMove,
  onOpen,
  onRename,
}: Readonly<FileTableRowActionsProps>) {
  const { t } = useTranslation();
  const file = row.original;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleItemClick = (action: (file: IFileData) => void) => {
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

  const handleDropdownOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
  };

  const handleDropdownContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const canDownload = onDownload !== undefined;
  const canDelete = onDelete !== undefined;
  const canShare = onShare !== undefined;
  const canMove = onMove !== undefined;
  const canRename = onRename !== undefined;
  const canCopy = onCopy !== undefined;
  const canOpen = onOpen !== undefined;

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
          {/* Open */}
          {canOpen && (
            <DropdownMenuItem onClick={() => handleItemClick(onOpen)}>
              <ExternalLink className="mr-2 h-4 w-4" />
              {t('OPEN')}
            </DropdownMenuItem>
          )}

          {/* Share */}
          {canShare && (
            <DropdownMenuItem onClick={() => handleItemClick(onShare)}>
              <Users className="mr-2 h-4 w-4" />
              {t('SHARE')}
            </DropdownMenuItem>
          )}

          {/* Copy */}
          {canCopy && (
            <DropdownMenuItem onClick={() => handleItemClick(onCopy)}>
              <Copy className="mr-2 h-4 w-4" />
              {t('COPY')}
            </DropdownMenuItem>
          )}

          {/* Move */}
          {canMove && (
            <DropdownMenuItem onClick={() => handleItemClick(onMove)}>
              <FolderOpen className="mr-2 h-4 w-4" />
              {t('MOVE')}
            </DropdownMenuItem>
          )}

          {/* Rename */}
          {canRename && (
            <DropdownMenuItem onClick={() => handleItemClick(onRename)}>
              <Edit className="mr-2 h-4 w-4" />
              {t('RENAME')}
            </DropdownMenuItem>
          )}

          {/* View Details */}
          <DropdownMenuItem onClick={() => handleItemClick(onViewDetails)}>
            <Info className="mr-2 h-4 w-4" />
            {t('VIEW_DETAILS')}
          </DropdownMenuItem>

          {/* Download - Now available for all file types */}
          {canDownload && (
            <DropdownMenuItem onClick={() => handleItemClick(onDownload)}>
              <Download className="mr-2 h-4 w-4" />
              {t('DOWNLOAD')}
            </DropdownMenuItem>
          )}

          {/* Remove/Delete */}
          {canDelete && (
            <DropdownMenuItem
              onClick={() => handleItemClick(onDelete)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('REMOVE')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        {/* {isEditModalOpen && (
          <EditFileDetails
            fileInfo={file}
            onClose={() => setIsEditModalOpen(false)}
          />
        )} */}
      </Dialog>
    </>
  );
}
