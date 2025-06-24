/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback } from 'react';
import { BaseGridView, createBasicFileFilter } from '../common-grid-view-helpers';
import { MyFileGridViewProps } from '../../types/file-manager.type';

const MyFileGridView: React.FC<MyFileGridViewProps> = (props) => {
  const queryBuilder = useCallback(
    (params: any) => ({
      page: params.page,
      pageSize: params.pageSize,
      filter: params.filters,
    }),
    []
  );

  const filterFiles = useCallback(createBasicFileFilter(), []);
  return <BaseGridView {...props} queryBuilder={queryBuilder} filterFiles={filterFiles} />;
};

export default MyFileGridView;
