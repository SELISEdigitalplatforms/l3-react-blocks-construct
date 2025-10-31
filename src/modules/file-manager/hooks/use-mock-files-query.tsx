import { useCallback, useEffect, useMemo, useState } from 'react';
import { IFileDataWithSharing } from '../utils/file-manager';
import { filesFolderContents, mockFileData } from '../utils/mock-data';
import { IFileData, QueryParams } from '../types/file-manager.type';

export const useMockFilesQuery = (queryParams: QueryParams) => {
  const [data, setData] = useState<null | { data: IFileDataWithSharing[]; totalCount: number }>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const memoizedQueryParams = useMemo(
    () => ({
      page: queryParams.page,
      pageSize: queryParams.pageSize,
      filterName: queryParams.filter.name ?? '',
      filterFileType: queryParams.filter.fileType ?? '',
      filterLastModified: queryParams.filter.lastModified,
      folderId: queryParams.folderId,
    }),
    [
      queryParams.page,
      queryParams.pageSize,
      queryParams.filter.name,
      queryParams.filter.fileType,
      queryParams.filter.lastModified,
      queryParams.folderId,
    ]
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

    if (params.filterLastModified?.from || params.filterLastModified?.to) {
      filteredData = filteredData.filter((file) => {
        const lastModified = file.lastModified;
        if (!lastModified) return false;

        if (params.filterLastModified?.from && lastModified < params.filterLastModified.from) {
          return false;
        }

        if (params.filterLastModified?.to) {
          const endOfDay = new Date(params.filterLastModified.to);
          endOfDay.setHours(23, 59, 59, 999);
          if (lastModified > endOfDay) {
            return false;
          }
        }

        return true;
      });
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
    let sourceData: IFileData[];

    if (memoizedQueryParams.folderId && filesFolderContents[memoizedQueryParams.folderId]) {
      sourceData = [...filesFolderContents[memoizedQueryParams.folderId]];
    } else {
      sourceData = [...mockFileData];
    }

    const filteredData = filterData(sourceData, memoizedQueryParams);
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
