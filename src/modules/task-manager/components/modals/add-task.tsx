import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-kit/select';
import { TaskItem, TaskSection } from '../../types/task-manager.types';

interface TaskSectionWithTasks extends TaskSection {
  tasks: TaskItem[];
}

/**
 * AddTaskDialog Component
 *
 * A reusable dialog component for adding a new task to a column.
 * This component supports:
 * - Entering a task title
 * - Selecting a column to add the task to
 *
 * Features:
 * - Provides an input field for entering the task title
 * - Includes a dropdown for selecting the column
 * - Includes buttons for adding or canceling the task creation
 *
 * Props:
 * @param {string | null} activeColumn - The ID of the currently active column
 * @param {ITaskManagerColumn[]} columns - The list of available columns
 * @param {(columnId: string, content: string) => void} onAddTask - Callback triggered when the task is added
 *
 * @example
 * // Basic usage
 * <AddTaskDialog
 *   activeColumn="1"
 *   columns={[{ id: '1', title: 'To do' }]}
 *   onAddTask={(columnId, content) => console.log('Task added:', columnId, content)}
 * />
 */

interface AddTaskProps {
  activeColumn: string | null;
  columns: TaskSectionWithTasks[];
  onAddTask: (columnId: string, content: string) => void;
}

export function AddTask({ activeColumn, columns, onAddTask }: Readonly<AddTaskProps>) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedColumnId, setSelectedColumnId] = useState(activeColumn ?? '1');
  const { t } = useTranslation();

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
          {t('ADD_TASK')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('ADD_NEW_TASK')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder={t('TASK_TITLE')}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Select value={selectedColumnId} onValueChange={(value) => setSelectedColumnId(value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('SELECT_COLUMN')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {columns.map((column) => (
                    <SelectItem key={column.ItemId} value={column.ItemId}>
                      {column.Title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <DialogClose asChild>
            <Button variant="outline">{t('CANCEL')}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleAddTask}>{t('ADD_TASK')}</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
