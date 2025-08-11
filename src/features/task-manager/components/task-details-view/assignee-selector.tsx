import { Plus, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { memo, useCallback, useState, useEffect } from 'react';
import { Button } from 'components/ui/button';
import { Label } from 'components/ui/label';
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

const AssigneeSelectorComponent = ({
  availableAssignees,
  selectedAssignees,
  onChange,
}: Readonly<AssigneeSelectorProps>) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set());

  // Update local selected when selectedAssignees changes
  useEffect(() => {
    setLocalSelected(new Set(selectedAssignees.map((a) => a.ItemId)));
  }, [selectedAssignees]);

  const handleSelect = useCallback(
    async (assignee: Assignee) => {
      const assigneeId = assignee.ItemId;
      const isSelected = localSelected.has(assigneeId);

      // Update local state immediately for better UX
      setLocalSelected((prev) => {
        const newSet = new Set(prev);
        if (isSelected) {
          newSet.delete(assigneeId);
        } else {
          newSet.add(assigneeId);
        }
        return newSet;
      });

      try {
        setIsProcessing((prev) => ({ ...prev, [assigneeId]: true }));

        const newAssignees = isSelected
          ? selectedAssignees.filter((a) => a.ItemId !== assigneeId)
          : [...selectedAssignees, assignee];

        onChange(newAssignees);
      } catch (error) {
        console.error('Failed to update assignee:', error);
        setLocalSelected(new Set(selectedAssignees.map((a) => a.ItemId)));
      } finally {
        setIsProcessing((prev) => ({ ...prev, [assigneeId]: false }));
      }
    },
    [selectedAssignees, localSelected, onChange]
  );

  return (
    <div>
      <Label className="text-high-emphasis text-base font-semibold">{t('ASSIGNEE')}</Label>
      <div className="flex items-center gap-2 mt-2">
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
                    return (
                      <CommandItem
                        key={assignee.ItemId}
                        value={assignee.ItemId}
                        onSelect={() => handleSelect(assignee)}
                        className="flex items-center px-2 py-1.5 cursor-pointer"
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded border transition-colors',
                            localSelected.has(assignee.ItemId) && !isProcessing[assignee.ItemId]
                              ? 'bg-primary border-primary'
                              : 'border-border',
                            isProcessing[assignee.ItemId] ? 'opacity-50' : ''
                          )}
                          aria-hidden="true"
                        >
                          {localSelected.has(assignee.ItemId) && !isProcessing[assignee.ItemId] && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                          {isProcessing[assignee.ItemId] && (
                            <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          )}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={assignee.ImageUrl} alt={assignee.Name} />
                          <AvatarFallback className="bg-gray-200 text-foreground text-xs">
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
};

export const AssigneeSelector = memo(AssigneeSelectorComponent);
