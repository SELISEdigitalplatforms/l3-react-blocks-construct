import React, { useState, useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from 'components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from 'components/ui/dialog';
import { Input } from 'components/ui/input';

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

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </Button>

      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setIsMenuOpen(false);
                setIsRenameDialogOpen(true);
              }}
            >
              <svg
                className="mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
              Rename List
            </button>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={handleDeleteClick}
            >
              <svg
                className="mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}

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
