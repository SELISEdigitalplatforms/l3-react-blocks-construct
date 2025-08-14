/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback } from 'react';
import { MyFileGridViewProps } from '../../types/file-manager.type';
import { createBasicFileFilter } from '../common-filters';
import { BaseGridView } from '../basic-grid-view';

const MyFileGridView: React.FC<MyFileGridViewProps> = (props) => {
  const queryBuilder = useCallback(
    (params: any) => ({
      page: params.page,
      pageSize: params.pageSize,
      filter: params.filters,
      folderId: props.currentFolderId,
    }),
    [props.currentFolderId]
  );

  const filterFiles = useCallback(createBasicFileFilter(), []);

  return (
    <></>
    // <BaseGridView
    //   {...props}
    //   queryBuilder={queryBuilder}
    //   filterFiles={filterFiles}
    //   currentFolderId={props.currentFolderId}
    //   onNavigateToFolder={props.onNavigateToFolder}
    // />
  );
};

export default MyFileGridView;
