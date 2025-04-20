import * as React from 'react';
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

interface Tag {
  id: string;
  label: string;
}

interface TagsSelectorProps {
  availableTags: Tag[];
  selectedTags: string[];
  onChange: (selectedTagIds: string[]) => void;
}

export function Tags({ availableTags, selectedTags, onChange }: TagsSelectorProps) {
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
      <Label className="text-high-emphasis text-base font-semibold">Tags</Label>
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
              <CommandInput placeholder="Enter tag name" />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
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
                      Clear all
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
