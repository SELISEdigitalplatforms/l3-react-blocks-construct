import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'components/ui/command';
import { Checkbox } from 'components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Assignee } from '../../types/task-manager.types';
import { cn } from 'lib/utils';

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

interface AssigneeSelectorProps {
  availableAssignees: Assignee[];
  selectedAssignees: Assignee[];
  onChange: (selected: Assignee[]) => void;
}

export function AssigneeSelector({
  availableAssignees,
  selectedAssignees,
  onChange,
}: Readonly<AssigneeSelectorProps>) {
  const { t } = useTranslation();
  const handleAssigneeToggle = (assignee: Assignee) => {
    const isSelected = selectedAssignees.some((a) => a.ItemId === assignee.ItemId);

    if (isSelected) {
      const newAssignees = selectedAssignees.filter((a) => a.ItemId !== assignee.ItemId);
      onChange(newAssignees);
    } else {
      const newAssignees = [...selectedAssignees, assignee];
      onChange(newAssignees);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {selectedAssignees.slice(0, 3).map((assignee) => (
            <Avatar key={assignee.ItemId} className="h-8 w-8 border-2 border-background">
              <AvatarImage src={assignee.ImageUrl} alt={assignee.Name} />
              <AvatarFallback className="bg-gray-300 text-foreground text-xs">
                {assignee.Name.split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          ))}
          {selectedAssignees.length > 3 && (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border-2 border-background">
              +{selectedAssignees.length - 3}
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-7 w-7 border-dashed">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-0 w-[240px]" align="start" sideOffset={4}>
            <Command>
              <CommandInput placeholder={t('SEARCH_MEMBERS')} className="h-9" />
              <CommandList className="max-h-[300px] overflow-y-auto">
                <CommandEmpty className="py-2 px-3 text-sm">{t('NO_MEMBERS_FOUND')}</CommandEmpty>
                <CommandGroup>
                  {availableAssignees.map((assignee) => {
                    const isSelected = selectedAssignees.some((a) => a.ItemId === assignee.ItemId);
                    return (
                      <CommandItem
                        key={assignee.ItemId}
                        onSelect={() => handleAssigneeToggle(assignee)}
                        className="flex items-center gap-2 px-2 py-1.5"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleAssigneeToggle(assignee)}
                          className="h-4 w-4 rounded"
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={assignee.ImageUrl} alt={assignee.Name} />
                          <AvatarFallback
                            className={cn(
                              'bg-gray-200 text-foreground text-xs',
                              isSelected && 'bg-primary text-primary-foreground'
                            )}
                          >
                            {assignee.Name.split(' ')
                              .map((n: string) => n[0])
                              .join('')
                              .toUpperCase()
                              .substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{assignee.Name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
