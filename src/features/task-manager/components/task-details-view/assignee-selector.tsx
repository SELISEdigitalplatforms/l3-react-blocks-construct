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
import { Plus } from 'lucide-react';

interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

interface AssigneeSelectorProps {
  availableAssignees: Assignee[];
  selectedAssignees: Assignee[];
  onChange: (selected: Assignee[]) => void;
}

export function AssigneeSelector({
  availableAssignees,
  selectedAssignees,
  onChange,
}: AssigneeSelectorProps) {
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
              <CommandInput placeholder="Search members" />
              <CommandList>
                <CommandEmpty>No members found.</CommandEmpty>
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
