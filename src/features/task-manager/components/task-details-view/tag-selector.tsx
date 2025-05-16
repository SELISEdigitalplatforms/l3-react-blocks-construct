import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Plus } from 'lucide-react';
import { cn } from 'lib/utils';
import { Button } from 'components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { Label } from 'components/ui/label';

/**
 * TagSelector Component
 *
 * A reusable component for selecting and managing tags.
 * This component allows users to:
 * - View selected tags
 * - Add or remove tags from a list of available tags
 * - Search for tags using a search input
 *
 * Features:
 * - Displays selected tags as badges
 * - Provides a searchable dropdown for selecting or deselecting tags
 * - Allows clearing all selected tags with a single button
 * - Uses a popover for a compact and user-friendly UI
 *
 * Props:
 * @param {Tag[]} availableTags - The list of all available tags
 * @param {string[]} selectedTags - The list of currently selected tag IDs
 * @param {(selectedTagIds: string[]) => void} onChange - Callback triggered when the selected tags change
 *
 * @returns {JSX.Element} The tag selector component
 *
 * @example
 * // Basic usage
 * <Tags
 *   availableTags={[
 *     { id: '1', label: 'Frontend' },
 *     { id: '2', label: 'Backend' },
 *   ]}
 *   selectedTags={['1']}
 *   onChange={(updatedTags) => console.log('Selected tags:', updatedTags)}
 * />
 */

interface Tag {
  id: string;
  label: string;
}

interface TagsSelectorProps {
  readonly availableTags: Tag[];
  readonly selectedTags: string[];
  readonly onChange: (selectedTagIds: string[]) => void;
}

export function Tags({ availableTags, selectedTags, onChange }: TagsSelectorProps) {
  const { t } = useTranslation();
  const [selectedValues, setSelectedValues] = React.useState<Set<string>>(new Set(selectedTags));

  React.useEffect(() => {
    setSelectedValues(new Set(selectedTags));
  }, [selectedTags]);

  const handleSelect = (value: string) => {
    const newSelectedValues = new Set(selectedValues);

    if (newSelectedValues.has(value)) {
      newSelectedValues.delete(value);
    } else {
      newSelectedValues.add(value);
    }

    setSelectedValues(newSelectedValues);
    onChange(Array.from(newSelectedValues));
  };

  const handleClear = () => {
    setSelectedValues(new Set());
    onChange([]);
  };

  return (
    <div>
      <Label className="text-high-emphasis text-base font-semibold">{t('TAGS')}</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {Array.from(selectedValues).map((tagId) => {
          const tag = availableTags.find((t) => t.id === tagId);
          return (
            <div
              key={tagId}
              className="bg-surface text-high-emphasis font-semibold text-sm px-3 py-1 rounded flex items-center"
            >
              {tag?.label}
            </div>
          );
        })}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-7 w-7 border-dashed">
              <Plus className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="sm:max-w-[200px] p-0">
            <Command>
              <CommandInput placeholder={t('ENTER_TAG_NAME')} />
              <CommandList>
                <CommandEmpty>{t('NO_TAGS_FOUND')}</CommandEmpty>
                <CommandGroup>
                  {availableTags.map((tag) => {
                    const isSelected = selectedValues.has(tag.id);
                    return (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => handleSelect(tag.id)}
                        className="flex items-center"
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-md border border-primary',
                            isSelected ? 'bg-primary text-white' : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        <span>{tag.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {selectedValues.size > 0 && (
                  <div className="border-t p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="w-full justify-center text-center"
                    >
                      {t('CLEAR_ALL')}
                    </Button>
                  </div>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
