import React, { useState, useEffect, useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import DataTable from '../../components/blocks/data-table/data-table';

import { useTranslation } from 'react-i18next';
import { IFileData, useMockFilesQuery } from 'features/file-manager/hooks/use-mock-files-query';
import FileTableToolbar from 'features/file-manager/components/file-table-toolbar';
import { createFileTableColumns } from 'features/file-manager/components/file-table-columns';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

/**
 * Table toolbar component for handling filters and search.
 */
const TableToolbar = ({
  table,
  onSearch,
  columns,
}: {
  table: Table<IFileData>;
  onSearch: (filters: {
    name: string;
    fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  }) => void;
  columns: any[];
}) => {
  return <FileTableToolbar table={table} onSearch={onSearch} columns={columns} />;
};

const FileListView: React.FC = () => {
  // const isMobile = useIsMobile();
  const [openSheet, setOpenSheet] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedFile, setSelectedFile] = useState<IFileData | null>(null);

  const { t } = useTranslation();

  const [filters, setFilters] = useState<{
    name: string;
    fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  }>({
    name: '',
    fileType: undefined,
  });

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const queryParams = {
    page: paginationState.pageIndex,
    pageSize: paginationState.pageSize,
    filter: filters,
  };

  const { data, isLoading, error } = useMockFilesQuery(queryParams);

  const handlePaginationChange = useCallback(
    (newPagination: { pageIndex: number; pageSize: number }) => {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      }));
    },
    []
  );

  useEffect(() => {
    if (data?.totalCount !== undefined) {
      setPaginationState((prev) => ({
        ...prev,
        totalCount: data.totalCount,
      }));
    }
  }, [data?.totalCount]);

  const handleSearch = useCallback(
    (newFilters: { name: string; fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video' }) => {
      setFilters(newFilters);
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    },
    []
  );

  const handleViewDetails = (file: IFileData) => {
    setSelectedFile(file);
    setOpenSheet(true);
  };

  useEffect(() => {
    if (openSheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [openSheet]);

  const handleDownload = () => undefined;

  const handleShare = (file: IFileData) => {
    setSelectedFile(file);
  };

  const handleDelete = (file: IFileData) => {
    setSelectedFile(file);
  };

  const columns = createFileTableColumns({
    onViewDetails: handleViewDetails,
    onDownload: handleDownload,
    onShare: handleShare,
    onDelete: handleDelete,
    onMove: () => undefined,
    onCopy: () => undefined,
    onOpen: () => undefined,
    onRename: () => undefined,
    t,
  });

  if (error) {
    return <div className="p-4 text-error">{t('ERROR_LOADING_FILES')}</div>;
  }

  const renderFilterToolbar = (table: Table<IFileData>) => (
    <TableToolbar table={table} onSearch={handleSearch} columns={columns} />
  );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="h-full flex-col flex w-full gap-6 md:gap-8">
        <DataTable
          data={data?.data || []}
          columns={columns}
          onRowClick={handleViewDetails}
          isLoading={isLoading}
          toolbar={(table) => renderFilterToolbar(table)}
          pagination={{
            pageIndex: paginationState.pageIndex,
            pageSize: paginationState.pageSize,
            totalCount: paginationState.totalCount,
          }}
          onPaginationChange={handlePaginationChange}
          manualPagination={true}
          mobileColumns={['name']}
          expandable={true}
        />
      </div>

      {/* {!isMobile && (
        <FileDetails 
          open={openSheet} 
          onOpenChange={setOpenSheet} 
          selectedFile={selectedFile} 
        />
      )} */}
    </div>
  );
};

export default FileListView;
