import { useCallback, useEffect } from 'react';
import { usePagination } from '../components/common-grid-view-helpers';
import { useMockFilesQuery } from './use-mock-files-query';

export const useGridViewData = (filters: any, queryBuilder: (params: any) => any) => {
  const { paginationState, updateTotalCount, loadMore } = usePagination(filters);

  const queryParams = queryBuilder({
    page: paginationState.pageIndex,
    pageSize: paginationState.pageSize,
    filters,
  });

  const { data, isLoading, error } = useMockFilesQuery(queryParams);

  useEffect(() => {
    if (data?.totalCount !== undefined) {
      updateTotalCount(data.totalCount);
    }
  }, [data?.totalCount, updateTotalCount]);

  const handleLoadMore = useCallback(() => {
    if (data && data.data.length < data.totalCount) {
      loadMore();
    }
  }, [data, loadMore]);

  return {
    data,
    isLoading,
    error,
    handleLoadMore,
  };
};
