import { FolderIcon, FileTextIcon, ImageIcon, FileMusic, FileVideo2 } from 'lucide-react';

export const sharedUsers = [
  { id: '1', name: 'Luca Meier' },
  { id: '2', name: 'Aaron Green' },
  { id: '3', name: 'Sarah Pavan' },
  { id: '4', name: 'Adrian Müller' },
];

type FileTypeOption = {
  value: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  backgroundColor: string;
};

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

export interface IFileTrashData {
  id: string;
  name: string;
  fileType: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
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
    trashedDate: new Date('2025-02-03'),
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
    trashedDate: new Date('2025-02-03'),
    isShared: true,
  },
  {
    id: '4',
    name: 'Design Assets 2',
    fileType: 'Folder',
    size: '21.4 MB',
    trashedDate: new Date('2025-02-03'),
    isShared: true,
  },
  {
    id: '5',
    name: 'Ftoof.jpg',
    fileType: 'Image',
    size: '21.4 MB',
    trashedDate: new Date('2025-02-03'),
    isShared: false,
  },
  {
    id: '6',
    name: 'Project Documents.doc',
    fileType: 'File',
    size: '21.4 MB',
    trashedDate: new Date('2025-02-03'),
    isShared: false,
  },
];
