/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';

import { BaseGridView } from '../basic-grid-view';
import { IFileDataWithSharing } from '../../utils/file-manager';

interface SharedFilesGridViewProps {
  onViewDetails?: (file: IFileDataWithSharing) => void;
  onFilePreview?: (file: IFileDataWithSharing) => void; // NEW: For file preview
  onShare: (file: IFileDataWithSharing) => void;
  onDelete: (file: IFileDataWithSharing) => void;
  onMove: (file: IFileDataWithSharing) => void;
  onCopy: (file: IFileDataWithSharing) => void;
  onRename: (file: IFileDataWithSharing) => void;
  filters: any;
  newFiles?: IFileDataWithSharing[];
  newFolders?: IFileDataWithSharing[];
  renamedFiles?: Map<string, IFileDataWithSharing>;
  fileSharedUsers?: Record<string, any[]>;
  filePermissions?: Record<string, any>;
  currentFolderId?: string;
  onNavigateToFolder?: (folderId: string) => void;
}

const SharedFileGridView: React.FC<SharedFilesGridViewProps> = (props) => {
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
      folderId: props.currentFolderId, // ✅ ADD folder support
    }),
    [props.currentFolderId] // ✅ ADD dependency
  );

  const filterFiles = useCallback(
    (files: IFileDataWithSharing[], filters: any): IFileDataWithSharing[] => {
      return files.filter((file) => {
        // Filter by file type
        if (filters.fileType && filters.fileType.length > 0) {
          if (!filters.fileType.includes(file.fileType)) return false;
        }

        // Filter by search term (file name)
        if (filters.name?.trim()) {
          const searchTerm = filters.name.toLowerCase();
          if (!file.name.toLowerCase().includes(searchTerm)) return false;
        }

        // Filter by shared by user
        if (filters.sharedBy?.trim()) {
          const sharedBy = (file as any).sharedBy?.toLowerCase() || '';
          if (!sharedBy.includes(filters.sharedBy.toLowerCase())) return false;
        }

        // Add other shared-specific filters here

        return true;
      });
    },
    []
  );

  return <BaseGridView {...props} queryBuilder={queryBuilder} filterFiles={filterFiles} />;
};

export default SharedFileGridView;
