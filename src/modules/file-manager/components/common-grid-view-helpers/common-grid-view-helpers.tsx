/* eslint-disable @typescript-eslint/no-empty-function */

import { useState, useEffect, useCallback } from 'react';
import { Row } from '@tanstack/react-table';
import { IFileDataWithSharing } from '../../utils/file-manager';
import { FileTableRowActions } from '../file-manager-row-actions/file-manager-row-actions';
import { IFileData } from '../../types/file-manager.type';
import { RegularFileDetailsSheet } from '../regular-file-details-sheet/regular-file-details-sheet';

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export const usePagination = (filters?: any) => {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
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

export interface FileActionProps {
  onViewDetails?: (file: IFileDataWithSharing) => void;
  onDownload?: (file: IFileDataWithSharing) => void;
  onShare?: (file: IFileDataWithSharing) => void;
  onDelete?: (file: IFileDataWithSharing) => void;
  onRename?: (file: IFileDataWithSharing) => void;
  onMove?: (file: IFileDataWithSharing) => void;
  onCopy?: (file: IFileDataWithSharing) => void;
}

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
    _getAllVisibleCells: () => [],
  } as Row<IFileData>;
};

export interface DirectFileActionsProps extends FileActionProps {
  file: IFileDataWithSharing;
  className?: string;
}

export function DirectFileActions({
  file,
  onViewDetails,
  onDownload,
  onShare,
  onDelete,
  onRename,
  onMove,
  className,
}: Readonly<DirectFileActionsProps>) {
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
}

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
          onCopy={props.onCopy}
        />
      );
    },
    [props]
  );

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
    renderActions,
    renderActionsDirectly,
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
