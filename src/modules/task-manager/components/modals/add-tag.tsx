import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui-kit/button';
import { Input } from '@/components/ui-kit/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui-kit/dialog';
import { useToast } from '@/hooks/use-toast';

/**
 * AddTagDialog Component
 *
 * A reusable dialog component for adding a new tag in a task manager.
 * This component supports:
 * - Entering a tag title
 * - Adding the tag to the task manager
 *
 * Features:
 * - Provides an input field for entering the tag title
 * - Includes buttons for adding or canceling the tag creation
 *
 * Props:
 * @param {(label: string) => void} onAddTag - Callback triggered when the tag is added
 *
 * @example
 * // Basic usage
 * <AddTag onAddTag={(label) => console.log('Tag added:', label)} />
 */

interface AddTagProps {
  onAddTag: (label: string) => Promise<void>;
  isLoading?: boolean;
}

export function AddTag({ onAddTag, isLoading: propIsLoading = false }: Readonly<AddTagProps>) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [newTagTitle, setNewTagTitle] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTag = async () => {
    if (!newTagTitle.trim()) return;

    setIsLoading(true);

    try {
      await onAddTag(newTagTitle);
      setNewTagTitle('');
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('UNABLE_ADD_TAG'),
        description: t('FAILED_TO_ADD_TAG'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4" /> Add Tag
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Tag</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Tag Title"
            value={newTagTitle}
            onChange={(e) => setNewTagTitle(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="mr-2" disabled={isLoading || propIsLoading}>
              {t('CANCEL')}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={handleAddTag}
              disabled={!newTagTitle.trim() || isLoading || propIsLoading}
            >
              {t('ADD_TAG')}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
