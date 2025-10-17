import * as React from 'react';
import { X } from 'lucide-react';

/**
 * EmailTagInput Component
 *
 * A reusable input component for entering multiple tags (such as email addresses).
 * Users can type and press Enter to add a tag, and remove them via a close button.
 *
 * Features:
 * - Supports dynamic tag entry via input
 * - Automatically trims and prevents duplicate tags
 * - Notifies parent components of changes through onChange
 * - Clean, flexible UI for managing tag lists
 *
 * Props:
 * @param {string} [placeholder='Enter and press enter...'] - Placeholder text for the input field
 * @param {string} [className] - Optional custom class names for styling the wrapper
 * @param {string[]} [value=[]] - Initial list of tags
 * @param {(tags: string[]) => void} [onChange] - Callback fired when the tags list changes
 * @param {string} type - Input type (e.g., 'email', 'text')
 *
 * @returns {JSX.Element} A tag input field component
 *
 * @example
 * // Basic usage
 * <EmailTagInput type="email" />
 *
 * // With state management
 * const [emails, setEmails] = useState<string[]>([]);
 * <EmailTagInput
 *   type="email"
 *   value={emails}
 *   onChange={setEmails}
 * />
 */

export interface TagInputProps {
  placeholder?: string;
  className?: string;
  value?: string[];
  onChange?: (tags: string[]) => void;
  type: string;
}

export const EmailTagInput = ({
  placeholder = 'Enter and press enter...',
  className = '',
  value = [],
  onChange,
  type = 'text',
}: TagInputProps) => {
  const [inputValue, setInputValue] = React.useState('');
  const [tags, setTags] = React.useState<string[]>(value);

  const addTag = (tag: string) => {
    if (tag.trim() === '' || tags.includes(tag.trim())) return;
    const updatedTags = [...tags, tag.trim()];
    setTags(updatedTags);
    onChange?.(updatedTags);
  };

  const removeTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
    onChange?.(updatedTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    }
  };

  const handleBlur = () => {
    if (inputValue.trim() !== '') {
      addTag(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className={`w-full rounded-md border-b border-input p-2 shadow-sm ${className}`}>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm shadow-sm"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tags.indexOf(tag))}
              className="text-medium-emphasis hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <input
          type={type}
          className="flex-1 bg-transparent outline-none text-sm min-w-[150px] capitalize"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
