import { useEffect, useState } from 'react';
import { IFileTrashData, trashMockData } from '../utils/file-manager';

export interface IFileData {
  id: string;
  name: string;
  lastModified: Date;
  fileType: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  size: string;
  isShared?: boolean;
  sharedBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
  sharedDate?: Date;
}

export const mockFileData: IFileData[] = [
  {
    id: '1',
    name: 'Meeting Notes',
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
  },
  {
    id: '2',
    name: 'Research Data',
    lastModified: new Date('2025-02-03'),
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
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
  },
  {
    id: '7',
    name: 'Image.jpg',
    lastModified: new Date('2025-02-03'),
    fileType: 'Image',
    size: '21.4 MB',
    isShared: true,
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
  },
];

interface QueryParams {
  filter: {
    name?: string;
    fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  };
  page: number;
  pageSize: number;
}

export const useMockFilesQuery = (queryParams: QueryParams) => {
  const [data, setData] = useState<null | { data: IFileData[]; totalCount: number }>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | unknown>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let filteredData = [...mockFileData];

        if (queryParams.filter.name) {
          filteredData = filteredData.filter((file) =>
            file.name.toLowerCase().includes(queryParams.filter.name?.toLowerCase() ?? '')
          );
        }

        if (queryParams.filter.fileType) {
          filteredData = filteredData.filter(
            (file) => file.fileType === queryParams.filter.fileType
          );
        }

        const startIndex = queryParams.page * queryParams.pageSize;
        const endIndex = startIndex + queryParams.pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setData({
          data: paginatedData,
          totalCount: filteredData.length,
        });
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [queryParams]);

  return { data, isLoading, error };
};

interface TrashQueryParams {
  filter: {
    name?: string;
    fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
    deletedDate?: {
      from?: Date;
      to?: Date;
    };
  };
  page: number;
  pageSize: number;
}

export const useMockTrashFilesQuery = (queryParams: TrashQueryParams) => {
  const [data, setData] = useState<null | { data: IFileTrashData[]; totalCount: number }>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | unknown>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let filteredData = [...trashMockData];

        if (queryParams.filter.name) {
          filteredData = filteredData.filter((file) =>
            file.name.toLowerCase().includes(queryParams.filter.name?.toLowerCase() ?? '')
          );
        }

        if (queryParams.filter.fileType) {
          filteredData = filteredData.filter(
            (file) => file.fileType === queryParams.filter.fileType
          );
        }

        if (queryParams.filter.deletedDate?.from || queryParams.filter.deletedDate?.to) {
          filteredData = filteredData.filter((file) => {
            const trashedDate = file.trashedDate;
            if (!trashedDate) return false;

            if (
              queryParams.filter.deletedDate?.from &&
              trashedDate < queryParams.filter.deletedDate.from
            ) {
              return false;
            }

            if (queryParams.filter.deletedDate?.to) {
              const endOfDay = new Date(queryParams.filter.deletedDate.to);
              endOfDay.setHours(23, 59, 59, 999);
              if (trashedDate > endOfDay) {
                return false;
              }
            }

            return true;
          });
        }

        const startIndex = queryParams.page * queryParams.pageSize;
        const endIndex = startIndex + queryParams.pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setData({
          data: paginatedData,
          totalCount: filteredData.length,
        });
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [queryParams]);

  return { data, isLoading, error };
};
