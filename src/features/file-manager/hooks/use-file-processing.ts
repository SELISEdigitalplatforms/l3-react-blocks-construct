import { useCallback } from 'react';
import { IFileDataWithSharing } from '../utils/file-manager';
import { FileEnhancementProps, useFileEnhancement } from './use-file-enhancement';

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

      const processedServerFiles = existingFiles.map((file) => {
        const renamedVersion = props.renamedFiles?.get(file.id);
        const baseFile = renamedVersion || file;
        return enhanceWithSharingData(baseFile);
      });

      const newFileIds = new Set([
        ...(props.newFiles?.map((f) => f.id) || []),
        ...(props.newFolders?.map((f) => f.id) || []),
      ]);
      const filteredServerFiles = processedServerFiles.filter((file) => !newFileIds.has(file.id));

      const enhancedNewFiles = (props.newFiles || []).map(enhanceWithSharingData);
      const enhancedNewFolders = (props.newFolders || []).map(enhanceWithSharingData);

      return [...enhancedNewFolders, ...enhancedNewFiles, ...filteredServerFiles];
    },
    [props.newFiles, props.newFolders, props.renamedFiles, enhanceWithSharingData]
  );

  return { processFiles };
};
