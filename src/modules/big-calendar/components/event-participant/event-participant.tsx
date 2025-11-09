import { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent } from '@/components/ui-kit/menubar';
import { Button } from '@/components/ui-kit/button';
import { Input } from '@/components/ui-kit/input';
import { Checkbox } from '@/components/ui-kit/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui-kit/avatar';
import { Label } from '@/components/ui-kit/label';
import { members } from '../../services/calendar-services';
import { Member } from '../../types/calendar-event.types';

interface EventParticipantProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  editMembers?: Member[];
}

/**
 * EventParticipant Component
 *
 * A component for managing event participants by selecting members from a list.
 * It provides a searchable dropdown menu to filter and select members, and displays
 * selected members as avatars. The component supports both predefined members and
 * additional members passed via props.
 *
 * Features:
 * - Displays selected members as avatars.
 * - Provides a searchable dropdown menu to filter members by name.
 * - Allows toggling member selection using checkboxes.
 * - Combines predefined members with additional members passed via props.
 *
 * Props:
 * - `selected`: `{string[]}` – An array of member IDs representing the currently selected participants.
 * - `onChange`: `{Function}` – Callback triggered when the selection changes. Receives an updated array of selected member IDs.
 * - `editMembers`: `{Member[]}` (optional) – An array of additional members to include in the participant list.
 *
 * @param {EventParticipantProps} props - The props for configuring the event participant component.
 * @example
 * <EventParticipant
 *   selected={['1', '2']}
 *   onChange={(selected) => handleParticipantChange(selected)}
 *   editMembers={[
 *     { id: '3', name: 'John Doe', image: 'https://example.com/john.jpg' },
 *   ]}
 * />
 */

export const EventParticipant = ({
  selected,
  onChange,
  editMembers,
}: Readonly<EventParticipantProps>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();
  const allMembers = useMemo(() => {
    const uniqueMap = new Map<string, Member>();
    [...(editMembers ?? []), ...members].forEach((m) => uniqueMap.set(m.id, m));
    return Array.from(uniqueMap.values());
  }, [editMembers]);

  const filteredMembers = allMembers.filter(
    (member) => member.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ?? false
  );

  const toggleSelection = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((m) => m !== id) : [...selected, id]);
  };

  return (
    <div className="flex items-center gap-2">
      {selected.length > 0 &&
        selected.map((id) => {
          const member = allMembers.find((m) => m.id === id);
          if (!member) return null;
          return (
            <Avatar
              key={`selected-${member.id || 'unknown'}`}
              className="ring-2 ring-neutral-50 shadow-md"
            >
              <AvatarImage alt={member.name} src={member.image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          );
        })}
      <Menubar className="border-none">
        <MenubarMenu>
          <MenubarTrigger asChild>
            <Button variant="outline" size="icon" className="border-dashed">
              <Plus className="w-5 h-5 text-high-emphasis" />
            </Button>
          </MenubarTrigger>
          <MenubarContent className="flex flex-col gap-6 py-2 px-3">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-base text-high-emphasis">{t('MEMBERS')}</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('SEARCH_MEMBERS')}
                  className="h-10 w-full rounded-lg bg-surface border-none pl-8"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {filteredMembers?.map((member) => (
                <div key={`member-${member.id || 'unknown'}`} className="flex items-center gap-2">
                  <Checkbox
                    id={`member-${member.id || 'unknown'}`}
                    checked={selected.includes(member.id)}
                    onCheckedChange={() => toggleSelection(member.id)}
                    className="border-medium-emphasis data-[state=checked]:border-none border-2 rounded-[2px]"
                  />
                  <Avatar className="ring-2 ring-neutral-50 w-6 h-6 shadow-md">
                    <AvatarImage alt={member.name} src={member.image} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Label
                    htmlFor={`member-${member.id || 'unknown'}`}
                    className="text-sm font-normal text-high-emphasis"
                  >
                    {member.name}
                  </Label>
                </div>
              ))}
            </div>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};
