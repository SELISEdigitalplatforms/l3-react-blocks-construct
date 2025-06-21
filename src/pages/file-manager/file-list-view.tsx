// import React, { useState, useEffect, useCallback } from 'react';
// import DataTable from '../../components/blocks/data-table/data-table';
// import { useTranslation } from 'react-i18next';
// import { IFileData, useMockFilesQuery } from 'features/file-manager/hooks/use-mock-files-query';
// import { createFileTableColumns } from 'features/file-manager/components/file-table-columns';
// import FileDetailsSheet from 'features/file-manager/components/file-manager-details';

// interface PaginationState {
//   pageIndex: number;
//   pageSize: number;
//   totalCount: number;
// }

// interface FileListViewProps {
//   onViewDetails: (file: IFileData) => void;
//   onDownload: (file: IFileData) => void;
//   onShare: (file: IFileData) => void;
//   onDelete: (file: IFileData) => void;
//   onMove: (file: IFileData) => void;
//   onCopy: (file: IFileData) => void;
//   onOpen: (file: IFileData) => void;
//   onRename: (file: IFileData) => void;
//   filters: {
//     name: string;
//     fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
//   };
// }

// const FileListView: React.FC<FileListViewProps> = ({
//   onViewDetails,
//   onShare,
//   onDelete,
//   onMove,
//   onCopy,
//   onOpen,
//   onRename,
//   filters,
// }) => {
//   const { t } = useTranslation();

//   // State for the details sheet
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<IFileData | null>(null);

//   const [paginationState, setPaginationState] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//     totalCount: 0,
//   });

//   const queryParams = {
//     page: paginationState.pageIndex,
//     pageSize: paginationState.pageSize,
//     filter: filters,
//   };

//   const { data, isLoading, error } = useMockFilesQuery(queryParams);

//   const handlePaginationChange = useCallback(
//     (newPagination: { pageIndex: number; pageSize: number }) => {
//       setPaginationState((prev) => ({
//         ...prev,
//         pageIndex: newPagination.pageIndex,
//         pageSize: newPagination.pageSize,
//       }));
//     },
//     []
//   );

//   useEffect(() => {
//     if (data?.totalCount !== undefined) {
//       setPaginationState((prev) => ({
//         ...prev,
//         totalCount: data.totalCount,
//       }));
//     }
//   }, [data?.totalCount]);

//   useEffect(() => {
//     setPaginationState((prev) => ({
//       ...prev,
//       pageIndex: 0,
//     }));
//   }, [filters]);

//   // Enhanced handlers to manage details sheet
//   const handleViewDetailsWrapper = useCallback(
//     (file: IFileData) => {
//       setSelectedFile(file);
//       setIsDetailsOpen(true);
//       onViewDetails(file);
//     },
//     [onViewDetails]
//   );

//   const handleCloseDetails = useCallback(() => {
//     setIsDetailsOpen(false);
//     setSelectedFile(null);
//   }, []);

//   const handleDownloadWrapper = () => undefined;

//   const handleShareWrapper = (file: IFileData) => {
//     setSelectedFile(file);
//     onShare(file);
//   };

//   const handleDeleteWrapper = (file: IFileData) => {
//     setSelectedFile(file);
//     onDelete(file);
//   };

//   const columns = createFileTableColumns({
//     onViewDetails: handleViewDetailsWrapper,
//     onDownload: handleDownloadWrapper,
//     onShare: handleShareWrapper,
//     onDelete: handleDeleteWrapper,
//     onMove: onMove,
//     onCopy: onCopy,
//     onOpen: onOpen,
//     onRename: onRename,
//     t,
//   });

//   if (error) {
//     return <div className="p-4 text-error">{t('ERROR_LOADING_FILES')}</div>;
//   }

//   return (
//     <div className="flex h-full w-full rounded-xl">
//       {/* Main content area */}
//       <div
//         className={`flex flex-col h-full transition-all duration-300 ${isDetailsOpen ? 'flex-1' : 'w-full'}`}
//       >
//         <div className="h-full flex-col flex w-full gap-6 md:gap-8">
//           <DataTable
//             data={data?.data || []}
//             columns={columns}
//             onRowClick={handleViewDetailsWrapper}
//             isLoading={isLoading}
//             pagination={{
//               pageIndex: paginationState.pageIndex,
//               pageSize: paginationState.pageSize,
//               totalCount: paginationState.totalCount,
//             }}
//             onPaginationChange={handlePaginationChange}
//             manualPagination={true}
//             mobileColumns={['name']}
//             expandable={true}
//           />
//         </div>
//       </div>

//       {/* Details Panel */}
//       <FileDetailsSheet
//         isOpen={isDetailsOpen}
//         onClose={handleCloseDetails}
//         file={selectedFile}
//         t={t}
//       />
//     </div>
//   );
// };

// export default FileListView;

import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IFileData, useMockFilesQuery } from 'features/file-manager/hooks/use-mock-files-query';
import { createFileTableColumns } from 'features/file-manager/components/file-table-columns';
import { useIsMobile } from 'hooks/use-mobile';
import DataTable from 'components/blocks/data-table/data-table';
import FileDetailsSheet from 'features/file-manager/components/file-manager-details';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

interface FileListViewProps {
  onViewDetails: (file: IFileData) => void;
  onShare: (file: IFileData) => void;
  onDelete: (file: IFileData) => void;
  onMove: (file: IFileData) => void;
  onCopy: (file: IFileData) => void;
  onOpen: (file: IFileData) => void;
  onRename: (file: IFileData) => void;
  filters: {
    name?: string;
    fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  };
}

const FileListView: React.FC<FileListViewProps> = ({
  onViewDetails,
  onShare,
  onDelete,
  onMove,
  onCopy,
  onOpen,
  onRename,
  filters,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // State for the details sheet
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<IFileData | null>(null);

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

  useEffect(() => {
    setPaginationState((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [filters]);

  // Enhanced handlers to manage details sheet
  const handleViewDetailsWrapper = useCallback(
    (file: IFileData) => {
      setSelectedFile(file);
      setIsDetailsOpen(true);
      onViewDetails(file);
    },
    [onViewDetails]
  );

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedFile(null);
  }, []);

  const handleDownloadWrapper = () => undefined;

  const handleShareWrapper = (file: IFileData) => {
    setSelectedFile(file);
    onShare(file);
  };

  const handleDeleteWrapper = (file: IFileData) => {
    setSelectedFile(file);
    onDelete(file);
  };

  const handleOpenWrapper = (file: IFileData) => {
    if (file.fileType === 'Folder') {
      onOpen(file);
    } else {
      // For files, show details instead
      handleViewDetailsWrapper(file);
    }
  };

  const columns = createFileTableColumns({
    onViewDetails: handleViewDetailsWrapper,
    onDownload: handleDownloadWrapper,
    onShare: handleShareWrapper,
    onDelete: handleDeleteWrapper,
    onMove: onMove,
    onCopy: onCopy,
    onOpen: handleOpenWrapper,
    onRename: onRename,
    t,
  });

  if (error) {
    return <div className="p-4 text-error">{t('ERROR_LOADING_FILES')}</div>;
  }

  // On mobile, when details are open, hide the main content
  const shouldHideMainContent = isMobile && isDetailsOpen;

  return (
    <div className="flex h-full w-full rounded-xl relative">
      {/* Main content area */}
      {!shouldHideMainContent && (
        <div
          className={`flex flex-col h-full transition-all duration-300 ${
            isDetailsOpen && !isMobile ? 'flex-1' : 'w-full'
          }`}
        >
          <div className="h-full flex-col flex w-full gap-6 md:gap-8">
            <DataTable
              data={data?.data || []}
              columns={columns}
              onRowClick={handleViewDetailsWrapper}
              isLoading={isLoading}
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
        </div>
      )}

      {/* Details Panel - Full screen on mobile, side panel on desktop */}
      <FileDetailsSheet
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        file={selectedFile}
        t={t}
      />
    </div>
  );
};

export default FileListView;
