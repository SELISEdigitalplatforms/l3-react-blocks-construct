/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import { SharedFilesListViewProps } from '../../types/file-manager.type';
import { BaseGridView, createSharedFileFilter } from '../common-grid-view-helpers';

const SharedFileGridView: React.FC<SharedFilesListViewProps> = (props) => {
  const queryBuilder = useCallback(
    (params: any) => ({
      page: params.page,
      pageSize: params.pageSize,
      filter: {
        name: params.filters.name ?? '',
        fileType: params.filters.fileType,
        sharedBy: params.filters.sharedBy,
        sharedDateFrom: params.filters.sharedDate?.from?.toISOString(),
        sharedDateTo: params.filters.sharedDate?.to?.toISOString(),
        modifiedDateFrom: params.filters.modifiedDate?.from?.toISOString(),
        modifiedDateTo: params.filters.modifiedDate?.to?.toISOString(),
      },
    }),
    []
  );

  const filterFiles = useCallback(createSharedFileFilter(), []);

  return <BaseGridView {...props} queryBuilder={queryBuilder} filterFiles={filterFiles} />;
};

export default SharedFileGridView;
