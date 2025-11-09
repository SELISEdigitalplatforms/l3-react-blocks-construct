import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-kit/button';
import { Badge } from '@/components/ui-kit/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui-kit/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui-kit/dropdown-menu';
import { Label } from '@/components/ui-kit/label';
import { ItemTag } from '../../types/task-manager.types';

interface TagsSelectorProps {
  availableTags: ItemTag[];
  selectedTags: ItemTag[];
  onChange: (selectedTags: ItemTag[]) => void;
}

function TagsComponent({ availableTags, selectedTags, onChange }: Readonly<TagsSelectorProps>) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelect = useCallback(
    (tag: ItemTag) => {
      onChange(
        selectedTags.some((t) => t.ItemId === tag.ItemId)
          ? selectedTags.filter((t) => t.ItemId !== tag.ItemId)
          : [...selectedTags, tag]
      );
    },
    [selectedTags, onChange]
  );

  const handleClear = useCallback(() => {
    onChange([]);
  }, [onChange]);

  const filteredTags = availableTags.filter((tag) =>
    tag.TagLabel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Label className="text-high-emphasis text-base font-semibold">{t('TAGS')}</Label>
      <div className="flex items-center gap-1 flex-wrap">
        {selectedTags.map((tag) => (
          <Badge
            key={tag.ItemId}
            className="bg-surface hover:bg-surface text-high-emphasis font-semibold text-sm px-3 py-1 rounded flex items-center"
          >
            {tag.TagLabel}
          </Badge>
        ))}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-dashed"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="p-0 w-[200px]"
            align="start"
            sideOffset={4}
            onInteractOutside={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
          >
            <Command>
              <CommandInput
                placeholder={t('ENTER_TAG_NAME')}
                className="h-9"
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList className="max-h-[300px] overflow-y-auto">
                <CommandEmpty className="py-2 px-3 text-sm">{t('NO_TAGS_FOUND')}</CommandEmpty>
                <CommandGroup>
                  {filteredTags.map((tag) => {
                    const isSelected = selectedTags.some((t) => t.ItemId === tag.ItemId);
                    return (
                      <CommandItem
                        key={tag.ItemId}
                        value={tag.TagLabel}
                        onSelect={() => handleSelect(tag)}
                        className="flex items-center px-2 py-1.5 cursor-pointer"
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-md border border-primary',
                            isSelected ? 'bg-primary text-white' : 'opacity-50 [&_svg]:invisible'
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
                {selectedTags.length > 0 && (
                  <div className="border-t p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClear();
                      }}
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

export const Tags = memo(TagsComponent);
