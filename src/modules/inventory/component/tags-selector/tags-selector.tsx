import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Checkbox } from '@/components/ui-kit/checkbox';
import { Label } from '@/components/ui-kit/label';
import { Input } from '@/components/ui-kit/input';

/**
 * TagsSelector component allows users to filter and select tags from a list of available tags.
 * It includes a search input to filter the tags and checkboxes to select/unselect tags.
 *
 * @component
 * @example
 * const tags = ['electronics', 'furniture', 'clothing'];
 * const selectedTags = ['electronics'];
 * const handleTagToggle = (tag) => {
 *   // handle tag toggle logic
 * };
 *
 * return (
 *   <TagsSelector
 *     tags={tags}
 *     selectedTags={selectedTags}
 *     handleTagToggle={handleTagToggle}
 *   />
 * );
 *
 * @param {Object} props - The props for the TagsSelector component.
 * @param {string[]} props.tags - The list of available tags.
 * @param {string[]} props.selectedTags - The list of currently selected tags.
 * @param {function} props.handleTagToggle - Callback function to handle tag selection or deselection.
 */

interface TagsSelectorProps {
  tags: string[];
  selectedTags: string[];
  handleTagToggle: (tag: string) => void;
}

export function TagsSelector({ tags, selectedTags, handleTagToggle }: Readonly<TagsSelectorProps>) {
  const { t } = useTranslation();
  const [searchTags, setSearchTags] = React.useState('');
  const filteredTags = tags.filter((tag) => tag.toLowerCase().includes(searchTags.toLowerCase()));

  return (
    <div className="flex flex-col w-full mt-4">
      <Label className="mb-2 text-high-emphasis font-semibold h-6">{t('TAGS')}</Label>
      <div className="relative w-full mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
        <Input
          className="w-full pl-10"
          placeholder={t('ENTER_TAG_NAME')}
          value={searchTags}
          onChange={(e) => setSearchTags(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 border rounded-md p-4 max-h-48 overflow-y-auto">
        {filteredTags.length > 0 ? (
          filteredTags.map((tag) => (
            <div key={tag} className="flex items-center gap-2">
              <Checkbox
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => handleTagToggle(tag)}
                id={`tag-${tag}`}
              />
              <Label htmlFor={`tag-${tag}`} className="cursor-pointer">
                {tag}
              </Label>
            </div>
          ))
        ) : (
          <p className="text-gray-500">{t('NO_TAGS_FOUND')}</p>
        )}
      </div>
    </div>
  );
}
