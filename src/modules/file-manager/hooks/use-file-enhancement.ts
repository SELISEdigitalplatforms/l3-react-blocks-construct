import { useCallback } from 'react';
import { IFileDataWithSharing } from '../utils/file-manager';

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
