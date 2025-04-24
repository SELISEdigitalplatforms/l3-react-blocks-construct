import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from 'components/ui/dialog';

interface AddColumnDialogProps {
  onAddColumn: (title: string) => void;
}

export function AddColumnDialog({ onAddColumn }: AddColumnDialogProps) {
  const [newColumnTitle, setNewColumnTitle] = useState<string>('');

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      onAddColumn(newColumnTitle);
      setNewColumnTitle('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex items-center bg-white hover:bg-white w-80">
          <Plus className="h-4 w-4" />
          Add List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New List</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="List title"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="mr-2">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleAddColumn}>Add List</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
