import { FolderIcon, FileTextIcon, ImageIcon, FileMusic, FileVideo2 } from 'lucide-react';
import { IFileData } from '../hooks/use-mock-files-query';
import { t } from 'i18next';
import { FileManagerFilters, SharedFilters, TrashFilters } from '../types/header-toolbar.type';

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export type UserRole = 'Viewer' | 'Editor' | 'Owner';

export interface SharedUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: UserRole;
}

export interface IFileDataWithSharing extends IFileData {
  sharedWith?: SharedUser[];
  sharePermissions?: { [key: string]: string };
}

export const sharedUsers = [
  { id: '1', name: 'Luca Meier' },
  { id: '2', name: 'Aaron Green' },
  { id: '3', name: 'Sarah Pavan' },
  { id: '4', name: 'Adrian Müller' },
];

export type FileTypeOption = {
  value: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  backgroundColor: string;
};

export const fileTypeOptions = [
  { value: 'Folder', label: t('FOLDER') },
  { value: 'File', label: t('FILE') },
  { value: 'Image', label: t('IMAGE') },
  { value: 'Audio', label: t('AUDIO') },
  { value: 'Video', label: t('VIDEO') },
];

export const getFileTypeOptions = (t: (key: string) => string): FileTypeOption[] => [
  {
    value: 'Folder',
    label: t('FOLDER'),
    icon: FolderIcon,
    iconColor: 'text-file-type-folder-icon',
    backgroundColor: 'bg-file-type-folder-background',
  },
  {
    value: 'File',
    label: t('FILE'),
    icon: FileTextIcon,
    iconColor: 'text-file-type-file-icon',
    backgroundColor: 'bg-file-type-file-background',
  },
  {
    value: 'Image',
    label: t('IMAGE'),
    icon: ImageIcon,
    iconColor: 'text-file-type-image-icon',
    backgroundColor: 'bg-file-type-image-background',
  },
  {
    value: 'Audio',
    label: t('AUDIO'),
    icon: FileMusic,
    iconColor: 'text-file-type-audio-icon',
    backgroundColor: 'bg-file-type-audio-background',
  },
  {
    value: 'Video',
    label: t('VIDEO'),
    icon: FileVideo2,
    iconColor: 'text-file-type-video-icon',
    backgroundColor: 'bg-file-type-video-background',
  },
];

export const getFileTypeIcon = (fileType: string) => {
  switch (fileType) {
    case 'Folder':
      return FolderIcon;
    case 'File':
      return FileTextIcon;
    case 'Image':
      return ImageIcon;
    case 'Audio':
      return FileMusic;
    case 'Video':
      return FileVideo2;
    default:
      return FileTextIcon;
  }
};

export const getFileTypeInfo = (fileType: string) => {
  const config = {
    Folder: {
      iconColor: 'text-file-type-folder-icon',
      backgroundColor: 'bg-file-type-folder-background',
    },
    File: {
      iconColor: 'text-file-type-file-icon',
      backgroundColor: 'bg-file-type-file-background',
    },
    Image: {
      iconColor: 'text-file-type-image-icon',
      backgroundColor: 'bg-file-type-image-background',
    },
    Audio: {
      iconColor: 'text-file-type-audio-icon',
      backgroundColor: 'bg-file-type-audio-background',
    },
    Video: {
      iconColor: 'text-file-type-video-icon',
      backgroundColor: 'bg-file-type-video-background',
    },
  };

  return config[fileType as keyof typeof config] || config.File;
};

export type FileType = 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';

export interface IFileTrashData {
  id: string;
  name: string;
  fileType: FileType;
  size: string;
  trashedDate: Date;
  isShared?: boolean;
}

export const trashMockData: IFileTrashData[] = [
  {
    id: '1',
    name: 'Adventure_Video.mp4',
    fileType: 'Video',
    size: '21.4 MB',
    trashedDate: new Date('2025-01-03'),
    isShared: false,
  },
  {
    id: '2',
    name: 'Cat.jpg',
    fileType: 'Image',
    size: '21.4 MB',
    trashedDate: new Date('2025-02-03'),
    isShared: false,
  },
  {
    id: '3',
    name: 'Design Assets',
    fileType: 'Folder',
    size: '21.4 MB',
    trashedDate: new Date('2025-03-03'),
    isShared: true,
  },
  {
    id: '4',
    name: 'Design Assets 2',
    fileType: 'Folder',
    size: '21.4 MB',
    trashedDate: new Date('2025-04-03'),
    isShared: true,
  },
  {
    id: '5',
    name: 'Ftoof.jpg',
    fileType: 'Image',
    size: '21.4 MB',
    trashedDate: new Date('2025-05-03'),
    isShared: false,
  },
  {
    id: '6',
    name: 'Project Documents.doc',
    fileType: 'File',
    size: '21.4 MB',
    trashedDate: new Date('2025-05-05'),
    isShared: false,
  },
];

export const getFileTypeDisplayName = (fileType: string): string => {
  switch (fileType) {
    case 'Folder':
      return 'Folder';
    case 'File':
      return 'Document';
    case 'Image':
      return 'Image';
    case 'Audio':
      return 'Audio File';
    case 'Video':
      return 'Video File';
    default:
      return 'Unknown';
  }
};

export interface FileDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  file: IFileData | null;
  t: (key: string) => string;
}

export const getSharedUsers = (file: IFileData | null): SharedUser[] => {
  if (!file) return [];

  const users: SharedUser[] = [
    {
      id: 'owner',
      name: 'Luca Meier',
      role: 'Owner',
      avatar: '/avatars/luca.jpg',
    },
  ];

  if (file.isShared) {
    users.push(
      {
        id: '2',
        name: 'Aaron Green',
        role: 'Editor',
        avatar: '/avatars/aaron.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        role: 'Viewer',
        avatar: '/avatars/sarah.jpg',
      },
      {
        id: '4',
        name: 'Michael Chen',
        role: 'Viewer',
        avatar: '/avatars/michael.jpg',
      }
    );
  }

  return users;
};

export interface FileCardProps {
  file: IFileData;
  onViewDetails?: (file: IFileData) => void;
  onDownload?: (file: IFileData) => void;
  onShare?: (file: IFileData) => void;
  onDelete?: (file: IFileData) => void;
  onMove?: (file: IFileData) => void;
  onCopy?: (file: IFileData) => void;
  onOpen?: (file: IFileData) => void;
  onRename?: (file: IFileData) => void;
  t: (key: string) => string;
}

export interface FileGridViewProps {
  onViewDetails: (file: IFileDataWithSharing) => void;
  onDownload: (file: IFileDataWithSharing) => void;
  onShare: (file: IFileDataWithSharing) => void;
  onDelete: (file: IFileDataWithSharing) => void;

  onRename: (file: IFileDataWithSharing) => void;
  filters: {
    name: string;
    fileType?: FileType;
  };
  newFiles?: IFileDataWithSharing[];
  newFolders?: IFileDataWithSharing[];
  renamedFiles?: Map<string, IFileDataWithSharing>;
  fileSharedUsers?: { [key: string]: SharedUser[] };
  filePermissions?: { [key: string]: { [key: string]: string } };
}

export interface MyFilesListViewProps {
  onViewDetails: (file: IFileDataWithSharing) => void;
  onShare: (file: IFileDataWithSharing) => void;
  onDelete: (file: IFileDataWithSharing) => void;

  onRename: (file: IFileDataWithSharing) => void;
  onRenameUpdate?: (oldFile: IFileDataWithSharing, newFile: IFileDataWithSharing) => void;
  filters: {
    name?: string;
    fileType?: FileType;
  };
  newFiles: IFileDataWithSharing[];
  newFolders: IFileDataWithSharing[];
  renamedFiles: Map<string, IFileDataWithSharing>;
  fileSharedUsers?: { [key: string]: SharedUser[] };
  filePermissions?: { [key: string]: { [key: string]: string } };
}

export interface FileManagerHeaderToolbarProps {
  viewMode?: string;
  handleViewMode: (view: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filters: FileManagerFilters;
  onFiltersChange: (filters: FileManagerFilters) => void;
  onFileUpload?: (files: File[]) => void;
  onFolderCreate?: (folderName: string) => void;
  sharedUsers?: Array<{ id: string; name: string }>;
}

export interface SharedWithMeHeaderToolbarProps {
  viewMode?: string;
  handleViewMode: (view: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filters: SharedFilters;
  onFiltersChange: (filters: SharedFilters) => void;
  onFileUpload?: (files: File[]) => void;
  onFolderCreate?: (folderName: string) => void;
  sharedUsers?: Array<{ id: string; name: string }>;
}

export interface TrashHeaderToolbarProps {
  viewMode?: string;
  handleViewMode: (view: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filters: TrashFilters;
  onFiltersChange: (filters: TrashFilters) => void;
  onClearTrash?: () => void;
  onRestoreSelected?: () => void;
  selectedItems?: string[];
}
