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
  parentFolderId?: string;
}

export const DYNAMIC_BREADCRUMB_TITLES = {
  '/trash': 'TRASH',
  '/trash/3': 'DESIGN_ASSETS',
  '/trash/4': 'DESIGN_ASSETS_2',
};

export const folderContents: Record<string, IFileTrashData[]> = {
  '3': [
    {
      id: '3-1',
      name: 'Logo_Design.png',
      fileType: 'Image',
      size: '2.1 MB',
      trashedDate: new Date('2025-01-03'),
      isShared: true,
      parentFolderId: '3',
    },
    {
      id: '3-2',
      name: 'Brand_Guidelines.pdf',
      fileType: 'File',
      size: '5.3 MB',
      trashedDate: new Date('2025-06-03'),
      isShared: true,
      parentFolderId: '3',
    },
    {
      id: '3-3',
      name: 'Icon_Set.svg',
      fileType: 'Image',
      size: '1.8 MB',
      trashedDate: new Date('2025-03-03'),
      isShared: true,
      parentFolderId: '3',
    },
  ],
  '4': [
    {
      id: '4-1',
      name: 'Mockup_Design.jpg',
      fileType: 'Image',
      size: '4.2 MB',
      trashedDate: new Date('2025-01-10'),
      isShared: true,
      parentFolderId: '4',
    },
    {
      id: '4-2',
      name: 'Style_Guide.docx',
      fileType: 'File',
      size: '3.1 MB',
      trashedDate: new Date('2025-04-03'),
      isShared: true,
      parentFolderId: '4',
    },
    {
      id: '4-3',
      name: 'Color_Palette.png',
      fileType: 'Image',
      size: '0.9 MB',
      trashedDate: new Date('2025-04-03'),
      isShared: true,
      parentFolderId: '4',
    },
  ],
};

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

export interface PreviewProps {
  file: IFileTrashData;
  onClose: () => void;
  t: (key: string) => string;
}

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
  currentFolderId?: string;
  onNavigateToFolder?: (folderId: string) => void;
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

export const filesFolderContents: Record<string, IFileDataWithSharing[]> = {
  '1': [
    {
      id: '1-1',
      name: 'Weekly_Standup_Notes.doc',
      lastModified: new Date('2025-02-01'),
      fileType: 'File',
      size: '2.3 MB',
      isShared: true,
      parentFolderId: '1',
      sharedBy: {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      sharedDate: new Date('2025-02-01'),
      sharedWith: [
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
      ],
    },
    {
      id: '1-2',
      name: 'Sprint_Planning.pdf',
      lastModified: new Date('2025-01-28'),
      fileType: 'File',
      size: '1.8 MB',
      isShared: true,
      parentFolderId: '1',
      sharedBy: {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      sharedDate: new Date('2025-01-28'),
      sharedWith: [
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
      ],
    },
    {
      id: '1-3',
      name: 'Action_Items.xlsx',
      lastModified: new Date('2025-01-25'),
      fileType: 'File',
      size: '0.9 MB',
      isShared: false,
      parentFolderId: '1',
      sharedBy: {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
      sharedDate: new Date('2025-01-25'),
    },
  ],
  '2': [
    // Research Data folder
    {
      id: '2-1',
      name: 'Survey_Results.csv',
      lastModified: new Date('2025-02-02'),
      fileType: 'File',
      size: '5.4 MB',
      isShared: true,
      parentFolderId: '2',
      sharedBy: {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      sharedDate: new Date('2025-02-02'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '4',
          name: 'Adrian Müller',
          avatar: '/avatars/adrian-muller.jpg',
        },
      ],
    },
    {
      id: '2-2',
      name: 'Analysis_Report.pdf',
      lastModified: new Date('2025-01-30'),
      fileType: 'File',
      size: '3.2 MB',
      isShared: true,
      parentFolderId: '2',
      sharedBy: {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      sharedDate: new Date('2025-01-30'),
      sharedWith: [
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
        {
          id: '4',
          name: 'Adrian Müller',
          avatar: '/avatars/adrian-muller.jpg',
        },
      ],
    },
    {
      id: '2-3',
      name: 'Raw_Data.json',
      lastModified: new Date('2025-01-27'),
      fileType: 'File',
      size: '12.1 MB',
      isShared: false,
      parentFolderId: '2',
      sharedBy: {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
      sharedDate: new Date('2025-01-27'),
    },
  ],
  '3': [
    {
      id: '3-1',
      name: 'Contract_Agreement.pdf',
      lastModified: new Date('2025-02-01'),
      fileType: 'File',
      size: '2.7 MB',
      isShared: true,
      parentFolderId: '3',
      sharedBy: {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
      sharedDate: new Date('2025-02-01'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
      ],
    },
    {
      id: '3-2',
      name: 'Client_Proposal.docx',
      lastModified: new Date('2025-01-29'),
      fileType: 'File',
      size: '4.1 MB',
      isShared: true,
      parentFolderId: '3',
      sharedBy: {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      sharedDate: new Date('2025-01-29'),
      sharedWith: [
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
        {
          id: '4',
          name: 'Adrian Müller',
          avatar: '/avatars/adrian-muller.jpg',
        },
      ],
    },
    {
      id: '3-3',
      name: 'Requirements_Spec.pdf',
      lastModified: new Date('2025-01-26'),
      fileType: 'File',
      size: '6.3 MB',
      isShared: true,
      parentFolderId: '3',
      sharedBy: {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      sharedDate: new Date('2025-01-26'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
      ],
    },
  ],
  '4': [
    {
      id: '4-1',
      name: 'Architecture_Diagram.png',
      lastModified: new Date('2025-02-01'),
      fileType: 'Image',
      size: '3.8 MB',
      isShared: true,
      parentFolderId: '4',
      sharedBy: {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      sharedDate: new Date('2025-02-01'),
      sharedWith: [
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
        {
          id: '4',
          name: 'Adrian Müller',
          avatar: '/avatars/adrian-muller.jpg',
        },
      ],
    },
    {
      id: '4-2',
      name: 'Technical_Specs.md',
      lastModified: new Date('2025-01-31'),
      fileType: 'File',
      size: '1.2 MB',
      isShared: true,
      parentFolderId: '4',
      sharedBy: {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
      sharedDate: new Date('2025-01-31'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
      ],
    },
    {
      id: '4-3',
      name: 'Code_Review.pdf',
      lastModified: new Date('2025-01-28'),
      fileType: 'File',
      size: '2.9 MB',
      isShared: false,
      parentFolderId: '4',
      sharedBy: {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
      sharedDate: new Date('2025-01-28'),
    },
  ],
  '5': [
    {
      id: '5-1',
      name: 'Logo_Variations.ai',
      lastModified: new Date('2025-02-02'),
      fileType: 'File',
      size: '8.4 MB',
      isShared: true,
      parentFolderId: '5',
      sharedBy: {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
      sharedDate: new Date('2025-02-02'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
      ],
    },
    {
      id: '5-2',
      name: 'UI_Components.sketch',
      lastModified: new Date('2025-01-30'),
      fileType: 'File',
      size: '15.7 MB',
      isShared: true,
      parentFolderId: '5',
      sharedBy: {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
      sharedDate: new Date('2025-01-30'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
        {
          id: '4',
          name: 'Adrian Müller',
          avatar: '/avatars/adrian-muller.jpg',
        },
      ],
    },
    {
      id: '5-3',
      name: 'Color_Palette.png',
      lastModified: new Date('2025-01-27'),
      fileType: 'Image',
      size: '1.1 MB',
      isShared: true,
      parentFolderId: '5',
      sharedBy: {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      sharedDate: new Date('2025-01-27'),
      sharedWith: [
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
      ],
    },
  ],
  '11': [
    {
      id: '11-1',
      name: 'Campaign_Banner.jpg',
      lastModified: new Date('2025-01-31'),
      fileType: 'Image',
      size: '7.2 MB',
      isShared: true,
      parentFolderId: '11',
      sharedBy: {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
      sharedDate: new Date('2025-01-31'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
      ],
    },
    {
      id: '11-2',
      name: 'Social_Media_Kit.zip',
      lastModified: new Date('2025-01-29'),
      fileType: 'File',
      size: '23.5 MB',
      isShared: true,
      parentFolderId: '11',
      sharedBy: {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      sharedDate: new Date('2025-01-29'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
        {
          id: '4',
          name: 'Adrian Müller',
          avatar: '/avatars/adrian-muller.jpg',
        },
      ],
    },
    {
      id: '11-3',
      name: 'Brand_Guidelines.pdf',
      lastModified: new Date('2025-01-26'),
      fileType: 'File',
      size: '9.8 MB',
      isShared: true,
      parentFolderId: '11',
      sharedBy: {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
      sharedDate: new Date('2025-01-26'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
        {
          id: '4',
          name: 'Adrian Müller',
          avatar: '/avatars/adrian-muller.jpg',
        },
      ],
    },
  ],
};

export const mockFileData: IFileDataWithSharing[] = [
  {
    id: '1',
    name: 'Meeting Notes',
    lastModified: new Date('2025-02-03'),
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: false,
    sharedBy: {
      id: '1',
      name: 'Luca Meier',
      avatar: '/avatars/luca-meier.jpg',
    },
    sharedDate: new Date('2025-02-03'),
  },
  {
    id: '2',
    name: 'Research Data',
    lastModified: new Date('2025-02-03'),
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: false,
    sharedBy: {
      id: '2',
      name: 'Aaron Green',
      avatar: '/avatars/aaron-green.jpg',
    },
    sharedDate: new Date('2025-02-03'),
  },
  {
    id: '3',
    name: 'Client Documents',
    lastModified: new Date('2025-02-03'),
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedBy: {
      id: '3',
      name: 'Sarah Pavan',
      avatar: '/avatars/sarah-pavan.jpg',
    },
    sharedDate: new Date('2025-02-03'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
    ],
  },
  {
    id: '4',
    name: 'Project Files',
    lastModified: new Date('2025-02-03'),
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedBy: {
      id: '1',
      name: 'Luca Meier',
      avatar: '/avatars/luca-meier.jpg',
    },
    sharedDate: new Date('2025-02-03'),
    sharedWith: [
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
    ],
  },
  {
    id: '5',
    name: 'Design Assets',
    lastModified: new Date('2025-02-03'),
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedBy: {
      id: '4',
      name: 'Adrian Müller',
      avatar: '/avatars/adrian-muller.jpg',
    },
    sharedDate: new Date('2025-02-03'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
    ],
  },
  {
    id: '6',
    name: 'Project Documents.doc',
    lastModified: new Date('2025-02-03'),
    fileType: 'File',
    size: '21.4 MB',
    isShared: true,
    sharedBy: {
      id: '3',
      name: 'Sarah Pavan',
      avatar: '/avatars/sarah-pavan.jpg',
    },
    sharedDate: new Date('2025-02-03'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
    ],
  },
  {
    id: '7',
    name: 'Image.jpg',
    lastModified: new Date('2025-02-03'),
    fileType: 'Image',
    size: '21.4 MB',
    isShared: false,
    sharedBy: {
      id: '4',
      name: 'Adrian Müller',
      avatar: '/avatars/adrian-muller.jpg',
    },
    sharedDate: new Date('2025-02-03'),
  },
  {
    id: '8',
    name: 'Chill Beats Mix.mp3',
    lastModified: new Date('2025-02-03'),
    fileType: 'Audio',
    size: '21.4 MB',
    isShared: true,
    sharedBy: {
      id: '2',
      name: 'Aaron Green',
      avatar: '/avatars/aaron-green.jpg',
    },
    sharedDate: new Date('2025-02-03'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
    ],
  },
  {
    id: '9',
    name: 'Adventure_Video.mp4',
    lastModified: new Date('2025-02-03'),
    fileType: 'Video',
    size: '21.4 MB',
    isShared: true,
    sharedBy: {
      id: '1',
      name: 'Luca Meier',
      avatar: '/avatars/luca-meier.jpg',
    },
    sharedDate: new Date('2025-02-03'),
    sharedWith: [
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
      {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
    ],
  },
  {
    id: '10',
    name: 'Requirements.doc',
    lastModified: new Date('2025-02-03'),
    fileType: 'File',
    size: '21.4 MB',
    isShared: true,
    sharedBy: {
      id: '3',
      name: 'Sarah Pavan',
      avatar: '/avatars/sarah-pavan.jpg',
    },
    sharedDate: new Date('2025-02-03'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
    ],
  },
  {
    id: '11',
    name: 'Marketing Assets',
    lastModified: new Date('2025-02-01'),
    fileType: 'Folder',
    size: '45.2 MB',
    isShared: true,
    sharedBy: {
      id: '4',
      name: 'Adrian Müller',
      avatar: '/avatars/adrian-muller.jpg',
    },
    sharedDate: new Date('2025-02-01'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
    ],
  },
  {
    id: '12',
    name: 'Budget Spreadsheet.xlsx',
    lastModified: new Date('2025-01-28'),
    fileType: 'File',
    size: '2.1 MB',
    isShared: true,
    sharedBy: {
      id: '2',
      name: 'Aaron Green',
      avatar: '/avatars/aaron-green.jpg',
    },
    sharedDate: new Date('2025-01-28'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
      {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
    ],
  },
  {
    id: '13',
    name: 'Team Photo.png',
    lastModified: new Date('2025-01-25'),
    fileType: 'Image',
    size: '8.7 MB',
    isShared: true,
    sharedBy: {
      id: '1',
      name: 'Luca Meier',
      avatar: '/avatars/luca-meier.jpg',
    },
    sharedDate: new Date('2025-01-25'),
    sharedWith: [
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
    ],
  },
  {
    id: '14',
    name: 'Presentation.pptx',
    lastModified: new Date('2025-01-20'),
    fileType: 'File',
    size: '15.3 MB',
    isShared: true,
    sharedBy: {
      id: '3',
      name: 'Sarah Pavan',
      avatar: '/avatars/sarah-pavan.jpg',
    },
    sharedDate: new Date('2025-01-20'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
    ],
  },
  {
    id: '15',
    name: 'Training Video.mp4',
    lastModified: new Date('2025-01-15'),
    fileType: 'Video',
    size: '125.8 MB',
    isShared: true,
    sharedBy: {
      id: '4',
      name: 'Adrian Müller',
      avatar: '/avatars/adrian-muller.jpg',
    },
    sharedDate: new Date('2025-01-15'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
    ],
  },
];
