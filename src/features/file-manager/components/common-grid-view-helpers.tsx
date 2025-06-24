/* eslint-disable @typescript-eslint/no-empty-function */

// hooks/usePagination.ts
import { useState, useEffect } from 'react';

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export const usePagination = (filters?: any) => {
  const isMobile = useIsMobile();

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: isMobile ? 20 : 50,
    totalCount: 0,
  });

  const updateTotalCount = useCallback((totalCount: number) => {
    setPaginationState((prev) => ({
      ...prev,
      totalCount,
    }));
  }, []);

  const resetToFirstPage = useCallback(() => {
    setPaginationState((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, []);

  const loadMore = useCallback(() => {
    setPaginationState((prev) => ({
      ...prev,
      pageIndex: prev.pageIndex + 1,
    }));
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    resetToFirstPage();
  }, [filters, resetToFirstPage]);

  return {
    paginationState,
    updateTotalCount,
    resetToFirstPage,
    loadMore,
  };
};

// hooks/useFileEnhancement.ts

export interface FileEnhancementProps {
  fileSharedUsers?: Record<string, any[]>;
  filePermissions?: Record<string, any>;
}

export const useFileEnhancement = ({ fileSharedUsers, filePermissions }: FileEnhancementProps) => {
  const enhanceWithSharingData = useCallback(
    (file: IFileDataWithSharing) => ({
      ...file,
      sharedWith: fileSharedUsers?.[file.id] || file.sharedWith || [],
      sharePermissions: filePermissions?.[file.id] || file.sharePermissions || {},
    }),
    [fileSharedUsers, filePermissions]
  );

  return { enhanceWithSharingData };
};

export interface FileProcessingProps extends FileEnhancementProps {
  newFiles?: IFileDataWithSharing[];
  newFolders?: IFileDataWithSharing[];
  renamedFiles?: Map<string, IFileDataWithSharing>;
}

export const useFileProcessing = (props: FileProcessingProps) => {
  const { enhanceWithSharingData } = useFileEnhancement(props);

  const processFiles = useCallback(
    (files: IFileDataWithSharing[]) => {
      const existingFiles = files || [];

      // Process server files with renamed versions
      const processedServerFiles = existingFiles.map((file) => {
        const renamedVersion = props.renamedFiles?.get(file.id);
        const baseFile = renamedVersion || file;
        return enhanceWithSharingData(baseFile);
      });

      // Filter out files that exist in new files/folders
      const newFileIds = new Set([
        ...(props.newFiles?.map((f) => f.id) || []),
        ...(props.newFolders?.map((f) => f.id) || []),
      ]);
      const filteredServerFiles = processedServerFiles.filter((file) => !newFileIds.has(file.id));

      // Enhance new files and folders
      const enhancedNewFiles = (props.newFiles || []).map(enhanceWithSharingData);
      const enhancedNewFolders = (props.newFolders || []).map(enhanceWithSharingData);

      return [...enhancedNewFolders, ...enhancedNewFiles, ...filteredServerFiles];
    },
    [props.newFiles, props.newFolders, props.renamedFiles, enhanceWithSharingData]
  );

  return { processFiles };
};

// utils/fileFilters.ts
export interface BasicFilters {
  name?: string;
  fileType?: string;
}

export interface SharedFilters extends BasicFilters {
  sharedBy?: string;
  sharedDate?: { from?: Date; to?: Date };
  modifiedDate?: { from?: Date; to?: Date };
}

export const createBasicFileFilter = () => {
  return (files: IFileDataWithSharing[], filters: BasicFilters) => {
    return files.filter((file) => {
      const matchesName =
        !filters.name || file.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesType = !filters.fileType || file.fileType === filters.fileType;
      return matchesName && matchesType;
    });
  };
};

export const createSharedFileFilter = () => {
  const validateFilter = (file: IFileDataWithSharing, filters: SharedFilters) => {
    if (filters.name && !file.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    if (filters.fileType && file.fileType !== filters.fileType) {
      return false;
    }
    if (filters.sharedBy && file.sharedBy?.id !== filters.sharedBy) {
      return false;
    }
    // Add date filtering logic here if needed
    return true;
  };

  return (files: IFileDataWithSharing[], filters: Record<string, any>) => {
    const sharedFilters = filters as SharedFilters;
    return files.filter((file) => validateFilter(file, sharedFilters));
  };
};

// utils/fileActions.ts
import { useCallback } from 'react';
import { Row } from '@tanstack/react-table';

export interface FileActionProps {
  onViewDetails?: (file: IFileDataWithSharing) => void;
  onDownload?: (file: IFileDataWithSharing) => void;
  onShare?: (file: IFileDataWithSharing) => void;
  onDelete?: (file: IFileDataWithSharing) => void;
  onRename?: (file: IFileDataWithSharing) => void;
  onMove?: (file: IFileDataWithSharing) => void;
}

// Alternative 1: Create a proper mock row factory
export const createTableRowMock = (file: IFileDataWithSharing): Row<IFileData> => {
  return {
    original: file as IFileData,
    id: file.id.toString(),
    index: 0,
    depth: 0,
    parentId: undefined,
    columnFilters: {},
    columnFiltersMeta: {},
    getValue: () => undefined,
    getUniqueValues: () => [],
    renderValue: () => undefined,
    getVisibleCells: () => [],
    getAllCells: () => [],
    getLeftVisibleCells: () => [],
    getRightVisibleCells: () => [],
    getCenterVisibleCells: () => [],
    getCell: () => undefined as any,
    _getAllCellsByColumnId: () => ({}),
    _uniqueValuesCache: {},
    _valuesCache: {},
    subRows: [],
    getLeafRows: () => [],
    getParentRow: () => undefined,
    getParentRows: () => [],
    _groupingValuesCache: {},
    getGroupingValue: () => undefined,
    getIsGrouped: () => false,
    getGroupingValues: () => [],
    getIsSelected: () => false,
    getIsSomeSelected: () => false,
    getIsAllSubRowsSelected: () => false,
    getCanSelect: () => true,
    getCanSelectSubRows: () => true,
    getCanMultiSelect: () => true,
    getToggleSelectedHandler: () => () => {},
    toggleSelected: () => {},
    getIsExpanded: () => false,
    getIsAllParentsExpanded: () => true,
    getCanExpand: () => false,
    toggleExpanded: () => {},
    getToggleExpandedHandler: () => () => {},
    pin: () => {},
    getIsPinned: () => false,
    getPinnedIndex: () => -1,
    getCanPin: () => false,
    _getAllVisibleCells: () => [], // <-- Added to satisfy Row<IFileData>
  } as Row<IFileData>;
};

// Alternative 2: Create a simplified file actions component that doesn't need Row
export interface DirectFileActionsProps extends FileActionProps {
  file: IFileDataWithSharing;
  className?: string;
}

export const DirectFileActions: React.FC<DirectFileActionsProps> = ({
  file,
  onViewDetails,
  onDownload,
  onShare,
  onDelete,
  onRename,
  onMove,
  className,
}) => {
  return (
    <div className={className}>
      {onViewDetails && (
        <button onClick={() => onViewDetails(file)} title="View Details">
          View
        </button>
      )}
      {onDownload && (
        <button onClick={() => onDownload(file)} title="Download">
          Download
        </button>
      )}
      {onShare && (
        <button onClick={() => onShare(file)} title="Share">
          Share
        </button>
      )}
      {onRename && (
        <button onClick={() => onRename(file)} title="Rename">
          Rename
        </button>
      )}
      {onMove && (
        <button onClick={() => onMove(file)} title="Move">
          Move
        </button>
      )}
      {onDelete && (
        <button onClick={() => onDelete(file)} title="Delete">
          Delete
        </button>
      )}
    </div>
  );
};

export const useFileActions = (props: FileActionProps) => {
  const renderActions = useCallback(
    (file: IFileDataWithSharing) => {
      const mockRow = createTableRowMock(file);
      return (
        <FileTableRowActions
          row={mockRow}
          onViewDetails={props.onViewDetails || (() => {})}
          onDownload={props.onDownload}
          onShare={props.onShare}
          onDelete={props.onDelete}
          onRename={props.onRename}
          onMove={props.onMove}
        />
      );
    },
    [props]
  );

  // Option 2: Use the direct actions component
  const renderActionsDirectly = useCallback(
    (file: IFileDataWithSharing) => (
      <DirectFileActions
        file={file}
        onViewDetails={props.onViewDetails}
        onDownload={props.onDownload}
        onShare={props.onShare}
        onDelete={props.onDelete}
        onRename={props.onRename}
        onMove={props.onMove}
      />
    ),
    [props]
  );

  return {
    renderActions, // Use this if you want to keep FileTableRowActions
    renderActionsDirectly, // Use this for a simpler approach
  };
};

// utils/fileDetailsSheet.ts

export const useFileDetailsSheet = (t: any) => {
  const renderDetailsSheet = useCallback(
    (file: IFileDataWithSharing | null, isOpen: boolean, onClose: () => void) => (
      <RegularFileDetailsSheet
        isOpen={isOpen}
        onClose={onClose}
        file={
          file
            ? {
                ...file,
                isShared: file.isShared ?? false,
                lastModified:
                  typeof file.lastModified === 'string'
                    ? file.lastModified
                    : (file.lastModified?.toISOString?.() ?? file.lastModified ?? ''),
              }
            : null
        }
        t={t}
      />
    ),
    [t]
  );

  return { renderDetailsSheet };
};

// hooks/useGridViewData.ts

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

// components/BaseGridView.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Folder } from 'lucide-react';
import { useIsMobile } from 'hooks/use-mobile';
import { getFileTypeIcon, getFileTypeInfo, IFileDataWithSharing } from '../utils/file-manager';
import { IFileData, useMockFilesQuery } from '../hooks/use-mock-files-query';
import { FileTableRowActions } from './file-manager-row-actions';
import { RegularFileDetailsSheet } from './regular-file-details-sheet';
import { CommonGridView } from './common-grid-view';

export interface BaseGridViewProps extends FileActionProps, FileProcessingProps {
  filters: any;
  onViewDetails?: (file: IFileDataWithSharing) => void;
  queryBuilder: (params: any) => any;
  filterFiles: (files: IFileDataWithSharing[], filters: any) => IFileDataWithSharing[];
}

export const BaseGridView: React.FC<BaseGridViewProps> = (props) => {
  const { t } = useTranslation();

  const { data, isLoading, error, handleLoadMore } = useGridViewData(
    props.filters,
    props.queryBuilder
  );

  const { processFiles } = useFileProcessing(props);
  const { renderActions } = useFileActions(props);
  const { renderDetailsSheet } = useFileDetailsSheet(t);

  return (
    <CommonGridView
      onViewDetails={props.onViewDetails}
      filters={props.filters}
      data={data ?? undefined}
      isLoading={isLoading}
      error={error}
      onLoadMore={handleLoadMore}
      renderDetailsSheet={renderDetailsSheet}
      getFileTypeIcon={getFileTypeIcon}
      getFileTypeInfo={getFileTypeInfo}
      renderActions={renderActions}
      emptyStateConfig={{
        icon: Folder,
        title: t('NO_FILES_FOUND'),
        description: t('NO_FILES_UPLOADED_YET'),
      }}
      sectionLabels={{
        folder: t('FOLDER'),
        file: t('FILE'),
      }}
      errorMessage={t('ERROR_LOADING_FILES')}
      loadingMessage={t('LOADING')}
      loadMoreLabel={t('LOAD_MORE')}
      processFiles={processFiles}
      filterFiles={props.filterFiles}
    />
  );
};
