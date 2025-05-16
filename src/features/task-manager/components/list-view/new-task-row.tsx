import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleIcon, GripVertical, Plus, X } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { useCardTasks } from '../../hooks/use-card-tasks';

/**
 * NewTaskRow Component
 *
 * A reusable component for adding a new task in a list view.
 * This component supports:
 * - Entering a task title
 * - Selecting a task status
 * - Adding or canceling the task creation
 *
 * Features:
 * - Provides an input field for entering the task title
 * - Allows selecting a task status from a dropdown
 * - Supports keyboard shortcuts (Enter to add, Escape to cancel)
 *
 * Props:
 * @param {(title: string, status: string) => void} onAdd - Callback triggered when the task is added
 * @param {() => void} onCancel - Callback triggered when the task creation is canceled
 *
 * @returns {JSX.Element} The new task row component
 *
 * @example
 * // Basic usage
 * <NewTaskRow onAdd={(title, status) => console.log(title, status)} onCancel={() => console.log('Canceled')} />
 */

interface NewTaskRowProps {
  onAdd: (title: string, status: string) => void;
  onCancel: () => void;
}

const toTranslationKey = (title: string): string => {
  return title.replace(/\s+/g, '_').toUpperCase();
};

export function NewTaskRow({ onAdd, onCancel }: Readonly<NewTaskRowProps>) {
  const { columns } = useCardTasks();
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskStatus, setNewTaskStatus] = useState<string>('To Do');
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAdd(newTaskTitle, newTaskStatus);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="flex items-center min-w-max border-b border-gray-200 h-14">
      <div className="w-12 flex items-center justify-center">
        <GripVertical className="h-4 w-4 text-gray-200" />
      </div>

      <div className="w-6 flex-shrink-0 flex items-center justify-center">
        <CircleIcon className="h-5 w-5 text-gray-300" />
      </div>

      <div className="w-96 pl-2 mr-4">
        <Input
          placeholder={t('ENTER_A_TITLE')}
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="h-10 text-sm w-full"
        />
      </div>

      <div className="w-24 flex-shrink-0">
        <Select value={newTaskStatus} onValueChange={setNewTaskStatus}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder={t('TO_DO')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {columns.map((column) => (
                <SelectItem key={column.id} value={column.title}>
                  {t(toTranslationKey(column.title))}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="w-24 flex-shrink-0" />
      <div className="w-28 flex-shrink-0" />
      <div className="w-32 flex-shrink-0" />
      <div className="w-32 flex-shrink-0" />

      <div className="flex items-center gap-2 ml-auto pr-4">
        <Button
          onClick={() => onAdd(newTaskTitle, newTaskStatus)}
          className="h-8 bg-primary hover:bg-primary-700 text-white px-4"
        >
          <Plus className="h-4 w-4 mr-1" /> {t('ADD')}
        </Button>
        <Button
          variant="ghost"
          onClick={onCancel}
          className="h-8 w-8 p-0 flex items-center justify-center "
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}
