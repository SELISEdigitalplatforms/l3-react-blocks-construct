import { useEffect, useState } from 'react';
import { IFileTrashData, trashMockData } from '../utils/file-manager';

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
  const [error, setError] = useState<string | null>(null);

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
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [queryParams]);

  return { data, isLoading, error };
};
