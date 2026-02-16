import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PenLine } from 'lucide-react';
import { Input } from '@/components/ui-kit/input';
import { Button } from '@/components/ui-kit/button';
import { useTaskDetails } from '../../hooks/use-task-details';

/**
 * EditableHeading Component
 *
 * A reusable component for displaying and editing task headings.
 * This component supports:
 * - Inline editing of headings with a text input
 * - Saving or canceling changes
 * - Automatically focusing the input field when editing starts
 *
 * Features:
 * - Allows users to edit headings inline
 * - Automatically focuses the input field when editing starts
 * - Saves changes on Enter key press or blur event
 * - Cancels editing and reverts to the original heading
 * - Displays an edit button when hovering over the heading
 *
 * Props:
 * @param {string} [taskId] - The ID of the task associated with the heading
 * @param {string} [initialValue] - The initial value of the heading
 * @param {string} [className] - Additional CSS classes for styling
 * @param {(value: string) => void} [onValueChange] - Callback triggered when the heading is saved
 * @param {boolean} [isNewTaskModalOpen] - Whether the component is rendered in a new task modal
 * @param {TaskService} [taskService] - Service for managing task-related operations
 *
 * @example
 * // Basic usage
 * <EditableHeading
 *   taskId="123"
 *   initialValue="Task Title"
 *   onValueChange={(newValue) => console.log('Saved heading:', newValue)}
 * />
 *
 * // With additional styling
 * <EditableHeading
 *   initialValue="Task Title"
 *   className="text-lg font-bold"
 * />
 */

interface EditableHeadingProps {
  taskId?: string;
  initialValue?: string;
  className?: string;
  onValueChange?: (value: string) => void;
  isNewTaskModalOpen?: boolean;
}

export function EditableHeading({
  taskId,
  initialValue,
  className = '',
  onValueChange,
  isNewTaskModalOpen,
}: Readonly<EditableHeadingProps>) {
  const { task, updateTaskDetails } = useTaskDetails(taskId);
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(isNewTaskModalOpen);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isEditing) {
      if (initialValue !== undefined && initialValue !== value) {
        setValue(initialValue);
      } else if (!initialValue && task?.Title) {
        setValue(task.Title);
      }
    }
  }, [initialValue, task?.Title, isEditing, value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveChanges();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const saveChanges = () => {
    if (!value) {
      setValue(initialValue ?? '');
      setIsEditing(!initialValue);
      return;
    }

    value && setIsEditing(false);
    if (onValueChange) {
      onValueChange(value);
    }

    if (task) {
      const updatedTask = { ...task, Title: value };
      updateTaskDetails(updatedTask);
    }
  };

  const cancelEditing = () => {
    value && setIsEditing(false);
    setValue(initialValue ?? '');
  };

  const handleBlur = () => {
    saveChanges();
  };

  return (
    <section
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label="Editable task heading"
    >
      {isEditing ? (
        <Input
          ref={inputRef}
          type="text"
          placeholder={t('ADD_A_TITLE')}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full px-3 py-2 text-3xl text-high-emphasis font-bold border rounded-md"
          data-testid="editable-heading-input"
        />
      ) : (
        <div className="flex items-center gap-1">
          <h1 className="text-3xl text-high-emphasis font-bold">{value}</h1>
          {isHovering && (
            <Button onClick={() => setIsEditing(true)} aria-label="Edit heading" variant="ghost">
              <PenLine className="h-4 w-4 text-primary" />
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
