import { FolderIcon, FileTextIcon, ImageIcon, FileMusic, FileVideo2 } from 'lucide-react';

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
