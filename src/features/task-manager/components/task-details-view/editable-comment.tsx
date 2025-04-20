import { useState, useRef, useEffect } from 'react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { parse } from 'date-fns';

interface EditableCommentProps {
  author: string;
  timestamp: string;
  initialComment: string;
  onEdit?: (newComment: string) => void;
  onDelete?: () => void;
}

export function EditableComment({
  author,
  timestamp,
  initialComment,
  onEdit,
  onDelete,
}: EditableCommentProps) {
  const [comment, setComment] = useState(initialComment);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const parsedTime = parse(timestamp, 'dd.MM.yyyy, HH:mm', new Date());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveChanges();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const saveChanges = () => {
    setIsEditing(false);
    if (onEdit) {
      onEdit(comment);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setComment(initialComment);
  };

  const handleBlur = () => {
    saveChanges();
  };

  return (
    <div className="flex gap-2">
      <div className="h-10 w-10 rounded-full bg-gray-300 text-xs flex items-center justify-center border-2 border-white">
        {author[0].toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <p className="text-sm font-bold text-high-emphasis">{author}</p>
          <span className="mx-2 h-2 w-2 rounded-full bg-neutral-200" />
          <p className="text-xs text-low-emphasis font-normal">{new Date(parsedTime).toLocaleString()}</p>
        </div>

        {isEditing ? (
          <Input
            ref={inputRef}
            value={comment}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full mt-1 p-2 text-sm border rounded-md "
            data-testid="editable-comment-input"
          />
        ) : (
          <p className="text-base text-high-emphasis font-normal">{comment}</p>
        )}

        {author == 'Block Smith' && (
          <div className="flex gap-2 mt-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 p-0 text-xs font-semibold text-primary"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 p-0 text-xs font-semibold text-primary"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
        )}
      </div>
    </div>
  );
}
