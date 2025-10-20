import { IFileDataWithSharing } from './file-manager';

export const enhanceNewEntries = (
  newFiles: IFileDataWithSharing[],
  newFolders: IFileDataWithSharing[],
  fileSharedUsers: { [key: string]: any[] } = {},
  filePermissions: { [key: string]: { [key: string]: string } } = {}
): IFileDataWithSharing[] => {
  const enhancedNewFiles = newFiles.map((file) => ({
    ...file,
    sharedWith: fileSharedUsers[file.id] || file.sharedWith || [],
    sharePermissions: filePermissions[file.id] || file.sharePermissions || {},
  }));

  const enhancedNewFolders = newFolders.map((folder) => ({
    ...folder,
    sharedWith: fileSharedUsers[folder.id] || folder.sharedWith || [],
    sharePermissions: filePermissions[folder.id] || folder.sharePermissions || {},
  }));

  return [...enhancedNewFiles, ...enhancedNewFolders];
};

export const enhanceFileWithSharing = (
  file: IFileDataWithSharing,
  fileSharedUsers: { [key: string]: any[] } = {},
  filePermissions: { [key: string]: { [key: string]: string } } = {}
): IFileDataWithSharing => ({
  ...file,
  sharedWith: fileSharedUsers[file.id] || file.sharedWith || [],
  sharePermissions: filePermissions[file.id] || file.sharePermissions || {},
});

export const mergeUniqueById = (
  localFiles: IFileDataWithSharing[],
  serverFiles: IFileDataWithSharing[]
): IFileDataWithSharing[] => {
  const localIds = new Set(localFiles.map((f) => f.id));
  const uniqueServer = serverFiles.filter((f) => !localIds.has(f.id));
  return [...localFiles, ...uniqueServer];
};
