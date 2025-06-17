import { useEffect, useState } from 'react';

export interface IFileData {
  id: string;
  name: string;
  lastModified: string;
  fileType: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  size: string;
  isShared?: boolean;
}

export const mockFileData: IFileData[] = [
  {
    id: '1',
    name: 'Meeting Notes',
    lastModified: '03.02.2025',
    fileType: 'Folder',
    size: '21.4 MB',
  },
  {
    id: '2',
    name: 'Research Data',
    lastModified: '03.02.2025',
    fileType: 'Folder',
    size: '21.4 MB',
  },
  {
    id: '3',
    name: 'Client Documents',
    lastModified: '03.02.2025',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
  },
  {
    id: '4',
    name: 'Project Files',
    lastModified: '03.02.2025',
    fileType: 'Folder',
    size: '21.4 MB',
  },
  {
    id: '5',
    name: 'Design Assets',
    lastModified: '03.02.2025',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
  },
  {
    id: '6',
    name: 'Project Documents.doc',
    lastModified: '03.02.2025',
    fileType: 'File',
    size: '21.4 MB',
  },
  {
    id: '7',
    name: 'Sunset_View_Image.jpg',
    lastModified: '03.02.2025',
    fileType: 'Image',
    size: '21.4 MB',
  },
  {
    id: '8',
    name: 'Chill Beats Mix.mp3',
    lastModified: '03.02.2025',
    fileType: 'Audio',
    size: '21.4 MB',
  },
  {
    id: '9',
    name: 'Adventure_Video.mp4',
    lastModified: '03.02.2025',
    fileType: 'Video',
    size: '21.4 MB',
  },
  {
    id: '10',
    name: 'Requirements.doc',
    lastModified: '03.02.2025',
    fileType: 'File',
    size: '21.4 MB',
    isShared: true,
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
