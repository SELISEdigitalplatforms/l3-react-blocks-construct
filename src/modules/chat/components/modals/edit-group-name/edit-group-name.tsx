import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
} from '@/components/ui-kit/dialog';
import { Button } from '@/components/ui-kit/button';
import { Input } from '@/components/ui-kit/input';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui-kit/label';

interface EditGroupNameProps {
  isOpen: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
  isLoading?: boolean;
}

export const EditGroupName = ({
  isOpen,
  currentName,
  onClose,
  onSave,
  isLoading = false,
}: Readonly<EditGroupNameProps>) => {
  const { t } = useTranslation();
  const [groupName, setGroupName] = useState(currentName);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setGroupName(currentName);
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError(t('GROUP_NAME_REQUIRED'));
      return;
    }
    onSave(groupName.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="hidden">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-medium text-high-emphasis">
              {t('GROUP_NAME')}
            </Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                if (error) setError('');
              }}
              placeholder={t('ENTER_GROUP_NAME')}
              className={cn(error && 'border-destructive focus-visible:ring-destructive')}
              disabled={isLoading}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="min-w-[112px]"
            >
              {t('CANCEL')}
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              className="min-w-[112px]"
              disabled={isLoading}
            >
              {t('SAVE')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
