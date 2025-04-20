import { useState, useRef, useEffect } from 'react';
import { PenLine } from 'lucide-react';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { TaskService } from '../../services/task-service';

interface EditableHeadingProps {
  initialValue?: string;
  className?: string;
  onValueChange?: (value: string) => void;
  isNewTaskModalOpen?: boolean;
  taskService?: TaskService;
}

export function EditableHeading({
  initialValue,
  className = '',
  onValueChange,
  isNewTaskModalOpen,
}: EditableHeadingProps) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(isNewTaskModalOpen);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveChanges();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const saveChanges = () => {
    if (value && onValueChange) {
      onValueChange(value);
    }
  };

  const cancelEditing = () => {
    setValue(initialValue ?? '');
  };

  const handleBlur = () => {
    saveChanges();
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isEditing ? (
        <Input
          ref={inputRef}
          type="text"
          placeholder="Add a title"
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
    </div>
  );
}
