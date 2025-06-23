import { IFileData } from '../hooks/use-mock-files-query';
import { IFileDataWithSharing, SharedUser } from '../utils/file-manager';

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
  onDownload: ((file: IFileData) => void) | undefined;
  onViewDetails: (file: IFileDataWithSharing) => void;
  onShare: (file: IFileDataWithSharing) => void;
  onDelete: (file: IFileDataWithSharing) => void;
  onMove: (file: IFileDataWithSharing) => void;
  onCopy: (file: IFileDataWithSharing) => void;
  onOpen: (file: IFileDataWithSharing) => void;
  onRename: (file: IFileDataWithSharing) => void;
  filters: SharedFilters;
  newFiles?: IFileDataWithSharing[];
  newFolders?: IFileDataWithSharing[];
  renamedFiles?: Map<string, IFileDataWithSharing>;
  fileSharedUsers?: Record<string, any[]>;
  filePermissions?: Record<string, any>;
}

export interface MyFileGridViewProps {
  onViewDetails: (file: IFileDataWithSharing) => void;
  onDownload: (file: IFileDataWithSharing) => void;
  onShare: (file: IFileDataWithSharing) => void;
  onDelete: (file: IFileDataWithSharing) => void;
  onRename: (file: IFileDataWithSharing) => void;
  filters: {
    name: string;
    fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  };
  newFiles?: IFileDataWithSharing[];
  newFolders?: IFileDataWithSharing[];
  renamedFiles?: Map<string, IFileDataWithSharing>;
  fileSharedUsers?: { [key: string]: SharedUser[] };
  filePermissions?: { [key: string]: { [key: string]: string } };
}
