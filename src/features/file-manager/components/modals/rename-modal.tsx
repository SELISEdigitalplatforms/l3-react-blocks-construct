import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'components/ui/dialog';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { useTranslation } from 'react-i18next';
import { IFileData } from '../../hooks/use-mock-files-query';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  file: IFileData | null;
}

export const RenameModal: React.FC<RenameModalProps> = ({ isOpen, onClose, onConfirm, file }) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (file && isOpen) {
      if (file.fileType === 'Folder') {
        setNewName(file.name);
      } else {
        const lastDotIndex = file.name.lastIndexOf('.');
        const nameWithoutExtension =
          lastDotIndex > 0 ? file.name.substring(0, lastDotIndex) : file.name;
        setNewName(nameWithoutExtension);
      }
      setError('');
    }
  }, [file, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim()) {
      setError(t('NAME_REQUIRED'));
      return;
    }

    if (
      newName.trim() === file?.name ||
      (file?.fileType !== 'Folder' && newName.trim() === getNameWithoutExtension(file?.name || ''))
    ) {
      setError(t('NAME_UNCHANGED'));
      return;
    }

    let finalName = newName.trim();

    if (file && file.fileType !== 'Folder') {
      const originalExtension = getFileExtension(file.name);
      if (originalExtension && !finalName.endsWith(originalExtension)) {
        finalName += originalExtension;
      }
    }

    onConfirm(finalName);
    handleClose();
  };

  const handleClose = () => {
    setNewName('');
    setError('');
    onClose();
  };

  const getFileExtension = (filename: string): string => {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex > 0 ? filename.substring(lastDotIndex) : '';
  };

  const getNameWithoutExtension = (filename: string): string => {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
  };

  if (!file) return null;

  const isFolder = file.fileType === 'Folder';
  const fileExtension = isFolder ? '' : getFileExtension(file.name);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isFolder ? t('RENAME_FOLDER') : t('RENAME_FILE')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {isFolder ? t('FOLDER_NAME') : t('FILE_NAME')}
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="name"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setError('');
                }}
                placeholder={isFolder ? t('ENTER_FOLDER_NAME') : t('ENTER_FILE_NAME')}
                className={error ? 'border-red-500' : ''}
                autoFocus
              />
              {!isFolder && fileExtension && (
                <span className="text-sm text-gray-500 whitespace-nowrap">{fileExtension}</span>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('CANCEL')}
            </Button>
            <Button type="submit" disabled={!newName.trim()}>
              {t('CONFIRM')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
