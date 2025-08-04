import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Plus } from 'lucide-react';
import { cn } from 'lib/utils';
import { Button } from 'components/ui/button';
import { Badge } from 'components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Label } from 'components/ui/label';
import { ItemTag } from '../../types/task-manager.types';

/**
 * TagSelector Component
 *
 * A reusable component for selecting and managing tags.
 * This component allows users to:
 * - View selected tags as badges
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
 * @param {ItemTag[]} availableTags - The list of all available tags
 * @param {ItemTag[]} selectedTags - The list of currently selected tags
 * @param {(selectedTags: ItemTag[]) => void} onChange - Callback triggered when the selected tags change
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

interface TagsSelectorProps {
  availableTags: ItemTag[];
  selectedTags: ItemTag[];
  onChange: (selectedTags: ItemTag[]) => void;
}

export function Tags({ availableTags, selectedTags, onChange }: Readonly<TagsSelectorProps>) {
  const { t } = useTranslation();
  const [selectedValues, setSelectedValues] = useState<Set<string>>(
    new Set(selectedTags.map((tag) => tag.ItemId))
  );

  useEffect(() => {
    setSelectedValues(new Set(selectedTags.map((tag) => tag.ItemId)));
  }, [selectedTags]);

  const handleSelect = (itemId: string, e?: React.MouseEvent) => {
    // Prevent event propagation to avoid immediate dropdown close
    e?.preventDefault();
    e?.stopPropagation();
    
    const tag = availableTags.find((t: ItemTag) => t.ItemId === itemId);
    if (!tag) return;

    // Create a new Set to ensure we trigger a state update
    const newSelectedValues = new Set(selectedValues);
    const isSelected = newSelectedValues.has(itemId);

    if (isSelected) {
      newSelectedValues.delete(itemId);
    } else {
      newSelectedValues.add(itemId);
    }

    // Convert selected IDs back to ItemTag objects
    const updatedSelectedTags: ItemTag[] = [];
    
    // First add all currently selected tags that are still selected
    selectedTags.forEach(tag => {
      if (newSelectedValues.has(tag.ItemId)) {
        updatedSelectedTags.push(tag);
        newSelectedValues.delete(tag.ItemId);
      }
    });
    
    // Then add any newly selected tags from availableTags
    availableTags.forEach(tag => {
      if (newSelectedValues.has(tag.ItemId)) {
        updatedSelectedTags.push(tag);
        newSelectedValues.delete(tag.ItemId);
      }
    });

    // Update local state
    setSelectedValues(new Set(updatedSelectedTags.map(t => t.ItemId)));
    // Propagate changes to parent
    onChange(updatedSelectedTags);
  };

  const handleClear = () => {
    setSelectedValues(new Set());
    onChange([]);
  };

  const isSelected = (itemId: string): boolean => selectedValues.has(itemId);

  return (
    <div>
      <Label className="text-high-emphasis text-base font-semibold">{t('TAGS')}</Label>
      <div className="flex items-center gap-1">
        {selectedTags
          .filter((tag) => selectedValues.has(tag.ItemId))
          .map((tag) => (
            <Badge
              key={tag.ItemId}
              className="bg-surface hover:bg-surface text-high-emphasis font-semibold text-sm px-3 py-1 rounded flex items-center"
            >
              {tag.TagLabel}
            </Badge>
          ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7 border-dashed"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-0 w-[200px]" align="start" sideOffset={4}>
            <Command>
              <CommandInput placeholder={t('ENTER_TAG_NAME')} className="h-9" />
              <CommandList className="max-h-[300px] overflow-y-auto">
                <CommandEmpty className="py-2 px-3 text-sm">{t('NO_TAGS_FOUND')}</CommandEmpty>
                <CommandGroup>
                  {availableTags.map((tag) => {
                    const selected = isSelected(tag.ItemId);
                    return (
                      <CommandItem
                        key={tag.ItemId}
                        value={tag.ItemId}
                        onSelect={(value) => {
                          // This will be called when the item is selected via keyboard
                          if (value !== tag.ItemId) return;
                          handleSelect(tag.ItemId);
                          return false; // Prevent default behavior
                        }}
                        className="flex items-center px-2 py-1.5 cursor-pointer"
                        onMouseDown={(e) => {
                          // Use onMouseDown instead of onClick to ensure it fires before the dropdown closes
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelect(tag.ItemId, e);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelect(tag.ItemId, e as any);
                          }
                        }}
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-md border border-primary',
                            selected ? 'bg-primary text-white' : 'opacity-50 [&_svg]:invisible'
                          )}
                          aria-hidden="true"
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-sm">{tag.TagLabel}</span>
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
                      className="w-full justify-center text-center text-sm"
                    >
                      {t('CLEAR_ALL')}
                    </Button>
                  </div>
                )}
              </CommandList>
            </Command>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
