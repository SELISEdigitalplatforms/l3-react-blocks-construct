import { IFileData } from '../hooks/use-mock-files-query';

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface SharedFilters {
  name: string;
  fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  sharedBy?: string;
  sharedDate?: DateRange;
  modifiedDate?: DateRange;
}

export interface SharedFilesListViewProps {
  onViewDetails: (file: IFileData) => void;
  onShare: (file: IFileData) => void;
  onDelete: (file: IFileData) => void;
  onMove: (file: IFileData) => void;
  onCopy: (file: IFileData) => void;
  onOpen: (file: IFileData) => void;
  onRename: (file: IFileData) => void;
  filters: SharedFilters;
}
