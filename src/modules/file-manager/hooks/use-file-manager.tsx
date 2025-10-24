/* eslint-disable no-console */
import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IFileDataWithSharing, SharedUser, UserRole } from '../utils/file-manager';

interface UseFileManagerProps {
  onCreateFile?: () => void;
}

export const useFileManager = ({ onCreateFile }: UseFileManagerProps = {}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newFiles, setNewFiles] = useState<IFileDataWithSharing[]>([]);
  const [newFolders, setNewFolders] = useState<IFileDataWithSharing[]>([]);
  const [renamedFiles, setRenamedFiles] = useState<Map<string, IFileDataWithSharing>>(new Map());
  const [fileSharedUsers, setFileSharedUsers] = useState<{ [key: string]: SharedUser[] }>({});
  const [filePermissions, setFilePermissions] = useState<{
    [key: string]: { [key: string]: string };
  }>({});

  // Modal states
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [fileToShare, setFileToShare] = useState<IFileDataWithSharing | null>(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<IFileDataWithSharing | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFileForDetails, setSelectedFileForDetails] = useState<IFileDataWithSharing | null>(
    null
  );

  const getFileTypeFromFile = (file: File): 'File' | 'Image' | 'Audio' | 'Video' => {
    const type = file.type;
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('audio/')) return 'Audio';
    if (type.startsWith('video/')) return 'Video';
    return 'File';
  };

  const handleFileUpload = useCallback((files: File[], isSharedContext = false) => {
    const uploadedFiles: IFileDataWithSharing[] = files.map((file) => ({
      id: uuidv4(),
      name: file.name,
      fileType: getFileTypeFromFile(file),
      size: file.size.toString(),
      lastModified: new Date(),
      ...(isSharedContext && {
        sharedBy: { id: 'current', name: 'Current User' },
        sharedDate: new Date(),
      }),
    }));

    setNewFiles((prev) => [...prev, ...uploadedFiles]);
  }, []);

  const handleFolderCreate = useCallback((folderName: string, isSharedContext = false) => {
    const newFolder: IFileDataWithSharing = {
      id: uuidv4(),
      name: folderName,
      fileType: 'Folder',
      size: '0',
      lastModified: new Date(),
      ...(isSharedContext && {
        sharedBy: { id: 'current', name: 'Current User' },
        sharedDate: new Date(),
      }),
    };

    setNewFolders((prev) => [...prev, newFolder]);
  }, []);

  const handleDownload = useCallback((file: IFileDataWithSharing) => {
    console.log('Download:', file);
  }, []);

  const handleDelete = useCallback((file: IFileDataWithSharing) => {
    setNewFiles((prev) => prev.filter((f) => f.id !== file.id));
    setNewFolders((prev) => prev.filter((f) => f.id !== file.id));
    setRenamedFiles((prev) => {
      const newMap = new Map(prev);
      newMap.delete(file.id);
      return newMap;
    });
    setFileSharedUsers((prev) => {
      const newSharedUsers = { ...prev };
      delete newSharedUsers[file.id];
      return newSharedUsers;
    });
    setFilePermissions((prev) => {
      const newPermissions = { ...prev };
      delete newPermissions[file.id];
      return newPermissions;
    });
  }, []);

  const handleMove = useCallback((file: IFileDataWithSharing) => {
    console.log('Move:', file);
  }, []);

  const handleCopy = useCallback((file: IFileDataWithSharing) => {
    console.log('Copy:', file);
  }, []);

  const handleOpen = useCallback((file: IFileDataWithSharing) => {
    console.log('Open:', file);
  }, []);

  const handleShare = useCallback((file: IFileDataWithSharing) => {
    setFileToShare(file);
    setIsShareModalOpen(true);
  }, []);

  const handleShareModalClose = useCallback(() => {
    setIsShareModalOpen(false);
    setFileToShare(null);
  }, []);

  const handleRename = useCallback((file: IFileDataWithSharing) => {
    setFileToRename(file);
    setIsRenameModalOpen(true);
  }, []);

  const handleRenameConfirm = useCallback(
    (newName: string) => {
      if (!fileToRename) return;

      const updatedFile = {
        ...fileToRename,
        name: newName,
        lastModified: new Date(),
      };

      const isLocalFile =
        fileToRename.fileType === 'Folder'
          ? newFolders.some((folder) => folder.id === fileToRename.id)
          : newFiles.some((file) => file.id === fileToRename.id);

      if (isLocalFile) {
        if (fileToRename.fileType === 'Folder') {
          setNewFolders((prev) =>
            prev.map((folder) => (folder.id === fileToRename.id ? updatedFile : folder))
          );
        } else {
          setNewFiles((prev) =>
            prev.map((file) => (file.id === fileToRename.id ? updatedFile : file))
          );
        }
      } else {
        setRenamedFiles((prev) => new Map(prev.set(fileToRename.id, updatedFile)));
      }

      setIsRenameModalOpen(false);
      setFileToRename(null);
    },
    [fileToRename, newFiles, newFolders]
  );

  const handleRenameModalClose = useCallback(() => {
    setIsRenameModalOpen(false);
    setFileToRename(null);
  }, []);

  const handleRenameUpdate = useCallback(
    (oldFile: IFileDataWithSharing, newFile: IFileDataWithSharing) => {
      const isLocalFile =
        oldFile.fileType === 'Folder'
          ? newFolders.some((folder) => folder.id === oldFile.id)
          : newFiles.some((file) => file.id === oldFile.id);

      if (isLocalFile) {
        if (oldFile.fileType === 'Folder') {
          setNewFolders((prev) =>
            prev.map((folder) => (folder.id === oldFile.id ? newFile : folder))
          );
        } else {
          setNewFiles((prev) => prev.map((file) => (file.id === oldFile.id ? newFile : file)));
        }
      } else {
        setRenamedFiles((prev) => new Map(prev.set(oldFile.id, newFile)));
      }
    },
    [newFiles, newFolders]
  );

  const handleViewModeChange = useCallback((mode: string) => {
    setViewMode(mode as 'grid' | 'list');
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCreateFile = useCallback(() => {
    if (onCreateFile) {
      onCreateFile();
    }
  }, [onCreateFile]);

  const getUpdatedFile = useCallback(
    (file: IFileDataWithSharing): IFileDataWithSharing => {
      const renamedFile = renamedFiles.get(file.id);
      if (renamedFile) {
        return renamedFile;
      }

      const isLocalFile =
        file.fileType === 'Folder'
          ? newFolders.some((folder) => folder.id === file.id)
          : newFiles.some((f) => f.id === file.id);

      if (isLocalFile) {
        const localFile =
          file.fileType === 'Folder'
            ? newFolders.find((folder) => folder.id === file.id)
            : newFiles.find((f) => f.id === file.id);
        return localFile || file;
      }

      const sharedUsers = fileSharedUsers[file.id];
      const permissions = filePermissions[file.id];

      if (sharedUsers || permissions) {
        return {
          ...file,
          sharedWith: sharedUsers || file.sharedWith,
          sharePermissions: permissions || file.sharePermissions,
          isShared:
            (sharedUsers && sharedUsers.length > 0) ||
            (file.sharedWith && file.sharedWith.length > 0),
        };
      }

      return file;
    },
    [newFiles, newFolders, renamedFiles, fileSharedUsers, filePermissions]
  );

  const handleViewDetails = useCallback(
    (file: IFileDataWithSharing) => {
      const updatedFile = getUpdatedFile(file);
      setSelectedFileForDetails(updatedFile);
      setIsDetailsOpen(true);
    },
    [getUpdatedFile]
  );

  const handleShareConfirm = useCallback(
    (users: SharedUser[], permissions: { [key: string]: string }) => {
      if (!fileToShare) return;

      const validatedUsers: SharedUser[] = users.map((user) => ({
        ...user,
        role: user.role as UserRole,
      }));

      const updatedFile = {
        ...fileToShare,
        sharedWith: validatedUsers,
        sharePermissions: permissions,
        lastModified: new Date(),
        isShared: validatedUsers.length > 0,
      };

      const isLocalFile =
        fileToShare.fileType === 'Folder'
          ? newFolders.some((folder) => folder.id === fileToShare.id)
          : newFiles.some((file) => file.id === fileToShare.id);

      if (isLocalFile) {
        if (fileToShare.fileType === 'Folder') {
          setNewFolders((prev) =>
            prev.map((folder) => (folder.id === fileToShare.id ? updatedFile : folder))
          );
        } else {
          setNewFiles((prev) =>
            prev.map((file) => (file.id === fileToShare.id ? updatedFile : file))
          );
        }
      } else {
        setRenamedFiles((prev) => new Map(prev.set(fileToShare.id, updatedFile)));
      }

      setFileSharedUsers((prev) => ({
        ...prev,
        [fileToShare.id]: users,
      }));
      setFilePermissions((prev) => ({
        ...prev,
        [fileToShare.id]: permissions,
      }));

      if (selectedFileForDetails && selectedFileForDetails.id === fileToShare.id) {
        setSelectedFileForDetails(updatedFile);
      }

      setIsShareModalOpen(false);
      setFileToShare(null);
    },
    [fileToShare, newFiles, newFolders, selectedFileForDetails]
  );

  return {
    // State
    viewMode,
    searchQuery,
    newFiles,
    newFolders,
    renamedFiles,
    fileSharedUsers,
    filePermissions,

    // Modal states
    isShareModalOpen,
    fileToShare,
    isRenameModalOpen,
    fileToRename,
    isDetailsOpen,
    selectedFileForDetails,

    // Handlers
    handleFileUpload,
    handleFolderCreate,
    handleDownload,
    handleDelete,
    handleMove,
    handleCopy,
    handleOpen,
    handleShare,
    handleShareModalClose,
    handleRename,
    handleRenameConfirm,
    handleRenameModalClose,
    handleRenameUpdate,
    handleViewModeChange,
    handleSearchChange,
    handleCreateFile,
    handleViewDetails,
    handleShareConfirm,
    getUpdatedFile,
  };
};
