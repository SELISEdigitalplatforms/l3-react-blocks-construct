import React from 'react';
import { IFileDataWithSharing } from '../../file-manager-details-sheet/file-manager-details-sheet';
import { SharedUser } from '@/modules/file-manager/utils/file-manager';

interface FileModalsProps {
  isRenameModalOpen: boolean;
  onRenameModalClose: () => void;
  onRenameConfirm: (newName: string) => void;
  fileToRename: IFileDataWithSharing | null;

  isShareModalOpen: boolean;
  onShareModalClose: () => void;
  onShareConfirm: (users: SharedUser[], permissions: { [key: string]: string }) => void;
  fileToShare: IFileDataWithSharing | null;

  RenameModalComponent: React.ComponentType<any>;
  ShareModalComponent: React.ComponentType<any>;
}

export const FileModals = ({
  isRenameModalOpen,
  onRenameModalClose,
  onRenameConfirm,
  fileToRename,
  isShareModalOpen,
  onShareModalClose,
  onShareConfirm,
  fileToShare,
  RenameModalComponent,
  ShareModalComponent,
}: Readonly<FileModalsProps>) => {
  return (
    <>
      <RenameModalComponent
        isOpen={isRenameModalOpen}
        onClose={onRenameModalClose}
        onConfirm={onRenameConfirm}
        file={fileToRename}
      />

      <ShareModalComponent
        isOpen={isShareModalOpen}
        onClose={onShareModalClose}
        onConfirm={onShareConfirm}
        currentSharedUsers={fileToShare ? (fileToShare.sharedWith ?? []) : []}
      />
    </>
  );
};
