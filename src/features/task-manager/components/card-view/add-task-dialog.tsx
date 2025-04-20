import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { ITaskManagerColumn } from '../../types/task';

interface AddTaskDialogProps {
  activeColumn: string | null;
  columns: ITaskManagerColumn[];
  onAddTask: (columnId: string, content: string) => void;
}

export function AddTaskDialog({ activeColumn, columns, onAddTask }: AddTaskDialogProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedColumnId, setSelectedColumnId] = useState(activeColumn || '1');

  useEffect(() => {
    if (activeColumn) {
      setSelectedColumnId(activeColumn);
    }
  }, [activeColumn]);

  const handleAddTask = () => {
    if (newTaskTitle.trim() && selectedColumnId) {
      onAddTask(selectedColumnId, newTaskTitle);
      setNewTaskTitle('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger id="add-task-dialog-trigger" asChild>
        <Button variant="ghost" className="hidden">
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Select value={selectedColumnId} onValueChange={(value) => setSelectedColumnId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
