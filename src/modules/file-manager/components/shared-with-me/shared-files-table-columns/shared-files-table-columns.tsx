import { ColumnDef } from '@tanstack/react-table';
import { IFileData } from '../../../types/file-manager.type';
import { FileTableRowActions } from '../../file-manager-row-actions/file-manager-row-actions';
import {
  createNameColumn,
  createSharedByColumn,
  createSharedDateColumn,
  createLastModifiedColumn,
  createSizeColumn,
  createActionsColumn,
} from '../../shared-columns-definitions/shared-column-definitions';

interface ColumnFactoryProps {
  onViewDetails: (file: IFileData) => void;
  onDownload: (file: IFileData) => void;
  onMove: (file: IFileData) => void;
  onCopy: (file: IFileData) => void;
  onOpen: (file: IFileData) => void;
  onRename: (file: IFileData) => void;
  onShare: (file: IFileData) => void;
  onDelete: (file: IFileData) => void;
  t: (key: string) => string;
}

export const SharedFileTableColumns = ({
  onViewDetails,
  onDownload,
  onShare,
  onDelete,
  onMove,
  onCopy,
  onRename,
  t,
}: ColumnFactoryProps): ColumnDef<IFileData, any>[] => [
  createNameColumn<IFileData>(t, {
    filterFn: (row, id, value: string) => {
      if (!value) return true;
      const name = row.original.name.toLowerCase();
      return name.includes(value.toLowerCase());
    },
  }),
  createSharedByColumn<IFileData>(t),
  createSharedDateColumn<IFileData>(t),
  createLastModifiedColumn<IFileData>(t),
  createSizeColumn<IFileData>(t),
  createActionsColumn<IFileData>((row) => (
    <FileTableRowActions
      row={row}
      onViewDetails={onViewDetails}
      onDownload={onDownload}
      onShare={onShare}
      onDelete={onDelete}
      onRename={onRename}
      onCopy={onCopy}
      onMove={onMove}
    />
  )),
];
