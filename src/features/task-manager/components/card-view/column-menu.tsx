import React, { useState, useRef } from 'react';
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react';
import { Button } from 'components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { useToast } from 'hooks/use-toast';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';

interface ColumnMenuProps {
  columnId: string;
  columnTitle: string;
  onRename: (columnId: string, newTitle: string) => void;
  onDelete: (columnId: string) => void;
}

export function ColumnMenu({ columnId, columnTitle, onRename, onDelete }: ColumnMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(columnTitle);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  React.useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleRenameSubmit = () => {
    if (newTitle.trim() && newTitle !== columnTitle) {
      onRename(columnId, newTitle);
    }
    setIsRenameDialogOpen(false);
  };

  const handleDeleteClick = () => {
    onDelete(columnId);
    setIsMenuOpen(false);
  };

  const handleConfirm = () => {
    handleDeleteClick();
    setOpen(false);
    toast({
      variant: 'success',
      title: 'Deleted',
      description: 'Column successfully deleted.',
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical
            className="h-5 w-5 text-high-emphasis cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-56">
          <DropdownMenuItem
            className="flex p-3 gap-2.5"
            onClick={() => {
              setIsMenuOpen(false);
              setIsRenameDialogOpen(true);
            }}
          >
            <SquarePen className="h-5 w-5 text-medium-emphasis" />
            <p className="font-normal text-high-emphasis">Rename List</p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex p-3 gap-2.5" onClick={() => setOpen(true)}>
            <Trash2 className="h-5 w-5 text-medium-emphasis" />
            <p className="font-normal text-high-emphasis">Delete</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationModal
        open={open}
        onOpenChange={setOpen}
        title="Are you sure?"
        description="This will permanently delete the column. This action cannot be undone."
        onConfirm={handleConfirm}
      />

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename List</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="List Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
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
              <Button onClick={handleRenameSubmit}>Save</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
