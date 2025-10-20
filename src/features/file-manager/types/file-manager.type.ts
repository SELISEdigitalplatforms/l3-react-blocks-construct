export interface DateRange {
  from?: Date;
  to?: Date;
}
export type FileType = 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';

export interface IFileData {
  id: string;
  name: string;
  lastModified: Date;
  fileType: FileType;
  size: string;
  isShared?: boolean;
  sharedBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
  sharedDate?: Date;
  parentFolderId?: string;
}

export interface QueryParams {
  filter: {
    name?: string;
    fileType?: FileType;
    lastModified?: {
      from?: Date;
      to?: Date;
    };
  };
  page: number;
  pageSize: number;
  folderId?: string;
}

export type FilterOption = {
  value: string;
  label: string;
};

export type WithLastModified = {
  lastModified?: string | Date;
  isShared?: boolean;
  [key: string]: any;
};
