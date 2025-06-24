import { useCallback, useEffect, useMemo, useState } from 'react';
import { FileType } from '../utils/file-manager';

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
}

export const mockFileData: IFileData[] = [
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
    fileType?: FileType;
  };
  page: number;
  pageSize: number;
}

export const useMockFilesQuery = (queryParams: QueryParams) => {
  const [data, setData] = useState<null | { data: IFileData[]; totalCount: number }>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const memoizedQueryParams = useMemo(
    () => ({
      page: queryParams.page,
      pageSize: queryParams.pageSize,
      filterName: queryParams.filter.name ?? '',
      filterFileType: queryParams.filter.fileType ?? '',
    }),
    [queryParams.page, queryParams.pageSize, queryParams.filter.name, queryParams.filter.fileType]
  );

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const filterData = useCallback((data: IFileData[], params: typeof memoizedQueryParams) => {
    let filteredData = [...data];

    if (params.filterName) {
      filteredData = filteredData.filter((file) =>
        file.name.toLowerCase().includes(params.filterName.toLowerCase())
      );
    }

    if (params.filterFileType) {
      filteredData = filteredData.filter((file) => file.fileType === params.filterFileType);
    }

    return filteredData;
  }, []);

  const paginateData = useCallback((data: IFileData[], params: typeof memoizedQueryParams) => {
    const startIndex = params.page * params.pageSize;
    const endIndex = startIndex + params.pageSize;
    return data.slice(startIndex, endIndex);
  }, []);

  const areItemsEqual = useCallback((item1: any, item2: any): boolean => {
    if (!item2) return false;

    return (
      item1.id === item2.id &&
      item1.name === item2.name &&
      item1.lastModified?.getTime() === item2.lastModified?.getTime()
    );
  }, []);

  const isDataEqual = useCallback(
    (prevData: any, newData: any) => {
      if (!prevData) return false;

      if (prevData.totalCount !== newData.totalCount) return false;
      if (prevData.data.length !== newData.data.length) return false;

      return prevData.data.every((item: any, index: number) =>
        areItemsEqual(item, newData.data[index])
      );
    },
    [areItemsEqual]
  );

  const processData = useCallback(() => {
    const filteredData = filterData(mockFileData, memoizedQueryParams);
    const paginatedData = paginateData(filteredData, memoizedQueryParams);

    return {
      data: paginatedData,
      totalCount: filteredData.length,
    };
  }, [filterData, paginateData, memoizedQueryParams]);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        const newData = processData();

        setData((prevData) => {
          if (isDataEqual(prevData, newData)) {
            return prevData;
          }
          return newData;
        });

        setIsLoading(false);
      } catch (err) {
        handleError(err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [memoizedQueryParams, refetch, processData, isDataEqual, handleError]);

  return { data, isLoading, error, refetch };
};
