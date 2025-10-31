import { Search, Edit, User, EllipsisVertical, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui-kit/avatar';
import { Input } from '@/components/ui-kit/input';
import { ChatContactItem } from '../chat-contact-item/chat-contact-item';
import { mockUserProfile } from '../../services/chat.services';
import { Button } from '@/components/ui-kit/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui-kit/dropdown-menu';
import { ChatContact } from '../../types/chat.types';

interface ChatSidebarProps {
  contacts: ChatContact[];
  onEditClick: () => void;
  isSearchActive?: boolean;
  isCollapsed?: boolean;
  onDiscardClick?: () => void;
  onContactSelect: (contact: ChatContact) => void;
  selectedContactId?: string | null;
  onMarkAsUnread?: (contactId: string) => void;
  onMarkAsRead?: (contactId: string) => void;
  onMuteToggle?: (contactId: string) => void;
  onDeleteContact?: (contactId: string) => void;
}

export const ChatSidebar = ({
  contacts,
  onEditClick,
  isSearchActive = false,
  isCollapsed = false,
  onDiscardClick,
  onContactSelect,
  selectedContactId,
  onMarkAsUnread,
  onMarkAsRead,
  onMuteToggle,
  onDeleteContact,
}: Readonly<ChatSidebarProps>) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactClick = (contact: ChatContact) => {
    onContactSelect(contact);
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div
      className={`${isCollapsed && !isMobile ? 'w-20 min-w-[80px]' : isMobile ? 'w-full' : 'w-[326px] min-w-[326px]'} ${!isMobile && 'border-r border-border'} bg-white flex flex-col transition-all duration-200 ease-in-out h-full`}
    >
      {!isCollapsed && (
        <div className="p-4 border-b border-border hidden md:flex">
          <h2 className="text-2xl font-bold">{t('CHAT')}</h2>
        </div>
      )}

      <div className="flex items-center justify-between p-4">
        <div className={`flex items-center gap-2 ${isCollapsed && 'border-b border-border pb-2'}`}>
          <Avatar>
            <AvatarImage src={mockUserProfile.avatarSrc} alt="sidebar avatar" />
            <AvatarFallback>{mockUserProfile.avatarFallback}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col">
              <p className="text-sm font-medium text-high-emphasis">{mockUserProfile.name}</p>
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${mockUserProfile.status.isOnline ? 'bg-success' : 'bg-low-emphasis'}`}
                />
                <span className="text-xs text-medium-emphasis">
                  {mockUserProfile.status.isOnline ? t('ONLINE') : t('OFFLINE')}
                </span>
              </div>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onEditClick}
            data-testid="edit-btn"
          >
            <Edit className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="flex flex-col flex-1 min-h-0 h-full">
        <div className="flex-shrink-0">
          {!isCollapsed && (
            <div className="p-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-medium-emphasis" />
                </div>
                <Input
                  type="text"
                  className="w-full py-2 pl-10 pr-3 text-sm bg-surface border-0 rounded-md focus:ring-2 focus:ring-primary focus:bg-white"
                  placeholder={t('SEARCH')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}
          {isSearchActive && (
            <div className="flex items-center justify-between w-full p-4 bg-primary-50">
              <div className="flex items-center gap-2">
                <div className="bg-neutral-100 border border-white flex items-center justify-center w-10 h-10 rounded-full">
                  <User className="w-6 h-6 text-medium-emphasis" />
                </div>
                <p className="font-medium text-high-emphasis">{t('NEW_CHAT')}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <EllipsisVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                  <DropdownMenuItem onClick={onDiscardClick} data-testid="discard-btn">
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('DISCARD')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto h-[calc(100vh-180px)] md:h-auto">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <ChatContactItem
                key={contact.id}
                id={contact.id}
                name={contact.name}
                email={contact.email}
                phoneNo={contact.phoneNo}
                avatarSrc={contact.avatarSrc}
                avatarFallback={contact.avatarFallback}
                date={contact.date}
                status={contact.status}
                messages={contact.messages}
                members={contact.members}
                onClick={handleContactClick}
                isSelected={contact.id === selectedContactId}
                isCollapsed={isCollapsed}
                onMarkAsUnread={onMarkAsUnread}
                onMarkAsRead={onMarkAsRead}
                onMuteToggle={onMuteToggle}
                onDeleteContact={onDeleteContact}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center text-medium-emphasis">
              <p>{t('NOTHING_FOUND')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
