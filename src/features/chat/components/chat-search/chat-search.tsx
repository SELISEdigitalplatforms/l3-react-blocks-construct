import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { mockChatContacts } from '../../data/chat.data';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { ScrollArea } from 'components/ui/scroll-area';

import { ChatContact } from '../../types/chat.types';

interface ChatSearchProps {
  onClose?: () => void;
  onSelectContact?: (contact: ChatContact) => void;
}

export const ChatSearch = ({ onClose, onSelectContact }: ChatSearchProps) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<(typeof mockChatContacts)[number][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredContacts = mockChatContacts.filter(
    (contact) =>
      !selectedUsers.some((selected) => selected.id === contact.id) &&
      (contact.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchValue.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectUser = (user: (typeof mockChatContacts)[number]) => {
    setSelectedUsers((prev) => [...prev, user]);
    setSearchValue('');
    inputRef.current?.focus();
  };

  const removeUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && searchValue === '' && selectedUsers.length > 0) {
      removeUser(selectedUsers[selectedUsers.length - 1].id);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        className={`relative flex w-full items-center flex-wrap gap-2 pl-4 pt-2 pb-1 border-b-2 ${isFocused ? 'border-primary' : 'border-muted'}`}
        onClick={() => inputRef.current?.focus()}
      >
        <Label className="text-medium-emphasis mr-2" htmlFor="chat-search-to">
          {t('LABEL_TO')}:
        </Label>
        <div className="flex items-center flex-wrap gap-2 flex-1">
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className="flex h-8 items-center gap-1 py-1 px-2 rounded-[4px] bg-surface"
            >
              <Avatar className="h-4 w-4">
                {user.avatarSrc && <AvatarImage src={user.avatarSrc} alt={user.name} />}
                <AvatarFallback className="text-xs">{user.avatarFallback}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-medium-emphasis">{user.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeUser(user.id);
                }}
                className="ml-1 rounded-full hover:bg-muted-foreground/10 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          <div className="flex-1">
            <Input
              ref={inputRef}
              id="chat-search-to"
              className="border-0 rounded-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full min-w-[100px] shadow-none"
              placeholder={selectedUsers.length === 0 ? t('ENTER_NAME_EMAIL_GROUP') : ''}
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setIsDropdownOpen(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsFocused(true);
                setIsDropdownOpen(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  if (!document.activeElement?.closest('.suggestions-dropdown')) {
                    setIsFocused(false);
                    setIsDropdownOpen(false);
                  }
                }, 200);
              }}
            />
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mr-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </button>

      {isDropdownOpen && (
        <div className="suggestions-dropdown absolute z-50 w-full mt-1 bg-popover text-popover-foreground shadow-lg rounded-md border">
          <ScrollArea className="max-h-60 overflow-auto">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                className="flex w-full items-center p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelectUser(contact);
                  if (onSelectContact) {
                    onSelectContact(contact);
                  }
                }}
              >
                <Avatar className="h-8 w-8 mr-2">
                  {contact.avatarSrc && <AvatarImage src={contact.avatarSrc} alt={contact.name} />}
                  <AvatarFallback>{contact.avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col ml-2">
                  <p className="text-sm text-left font-medium truncate">{contact.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                </div>
              </button>
            ))}
            {filteredContacts.length === 0 && (
              <div className="p-2 text-low-emphasis text-center">No contacts found</div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
