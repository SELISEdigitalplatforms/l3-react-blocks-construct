import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'components/ui/command';
import { Checkbox } from 'components/ui/checkbox';

/**
 * AssigneeSelector Component
 *
 * A reusable component for selecting and managing task assignees.
 * This component allows users to:
 * - View selected assignees with avatars
 * - Add or remove assignees from a list of available members
 * - Search for members using a search input
 *
 * Features:
 * - Displays up to 3 selected assignees with avatars
 * - Shows a "+X" badge for additional assignees beyond the first 3
 * - Provides a searchable dropdown for selecting or deselecting assignees
 * - Uses a popover for a compact and user-friendly UI
 *
 * Props:
 * @param {Assignee[]} availableAssignees - The list of all available assignees
 * @param {Assignee[]} selectedAssignees - The list of currently selected assignees
 * @param {(selected: Assignee[]) => void} onChange - Callback triggered when the selected assignees change
 *
 * @returns {JSX.Element} The assignee selector component
 *
 * @example
 * // Basic usage
 * <AssigneeSelector
 *   availableAssignees={allMembers}
 *   selectedAssignees={taskAssignees}
 *   onChange={(updatedAssignees) => setTaskAssignees(updatedAssignees)}
 * />
 */

interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

interface AssigneeSelectorProps {
  readonly availableAssignees: readonly Assignee[];
  readonly selectedAssignees: readonly Assignee[];
  readonly onChange: (selected: Assignee[]) => void;
}

export function AssigneeSelector({
  availableAssignees,
  selectedAssignees,
  onChange,
}: AssigneeSelectorProps) {
  const { t } = useTranslation();
  const handleAssigneeToggle = (assignee: Assignee) => {
    if (selectedAssignees.some((a) => a.id === assignee.id)) {
      onChange(selectedAssignees.filter((a) => a.id !== assignee.id));
    } else {
      onChange([...selectedAssignees, assignee]);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mt-2">
        <div className="flex -space-x-3">
          {selectedAssignees.slice(0, 3).map((assignee) => (
            <div
              key={assignee.id}
              className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm border-2 border-white"
            >
              {assignee.name[0]}
            </div>
          ))}
          {selectedAssignees.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm border-2 border-white">
              +{selectedAssignees.length - 3}
            </div>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-7 w-7 border-dashed">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="sm:max-w-[200px] p-0">
            <Command>
              <CommandInput placeholder={t('SEARCH_MEMBERS')} />
              <CommandList>
                <CommandEmpty>{t('NO_MEMBERS_FOUND')}</CommandEmpty>
                <CommandGroup>
                  {availableAssignees.map((assignee) => {
                    const isSelected = selectedAssignees.some((a) => a.id === assignee.id);
                    return (
                      <CommandItem
                        key={assignee.id}
                        onSelect={() => handleAssigneeToggle(assignee)}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleAssigneeToggle(assignee)}
                        />
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm border-2 border-white">
                          {assignee.name[0]}
                        </div>
                        <span>{assignee.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
