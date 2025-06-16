import { Search, Edit, User, EllipsisVertical, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Input } from 'components/ui/input';
import { ChatContactItem } from '../chat-contact-item/chat-contact-item';
import { mockChatContacts, mockUserProfile } from '../../data/chat.data';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { ChatContact } from '../../types/chat.types';

interface ChatSidebarProps {
  onEditClick: () => void;
  isSearchActive?: boolean;
  onDiscardClick?: () => void;
  onContactSelect?: (contact: ChatContact) => void;
}

export const ChatSidebar = ({
  onEditClick,
  isSearchActive = false,
  onDiscardClick,
  onContactSelect,
}: Readonly<ChatSidebarProps>) => {
  const { t } = useTranslation();

  useEffect(() => {
    // Save the current overflow value
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Disable body scroll when sidebar mounts
    document.body.style.overflow = 'hidden';

    // Re-enable body scroll when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="w-[400px] min-w-[400px] border-r border-border bg-white flex flex-col">
      <div className="flex items-center justify-between p-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={mockUserProfile.avatarSrc} alt="sidebar avatar" />
            <AvatarFallback>{mockUserProfile.avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-high-emphasis">{mockUserProfile.name}</p>
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${mockUserProfile.isOnline ? 'bg-success' : 'bg-low-emphasis'}`}
              />
              <span className="text-xs text-medium-emphasis">
                {mockUserProfile.isOnline ? t('ONLINE') : t('OFFLINE')}
              </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={onEditClick}>
          <Edit className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-shrink-0">
          <div className="p-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-medium-emphasis" />
              </div>
              <Input
                type="text"
                className="w-full py-2 pl-10 pr-3 text-sm bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder={t('SEARCH')}
              />
            </div>
          </div>
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
                  <DropdownMenuItem onClick={onDiscardClick}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('DISCARD')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockChatContacts.map((contact) => (
            <ChatContactItem key={contact.id} {...contact} onClick={onContactSelect} />
          ))}
          <div className="h-16" />
        </div>
      </div>
    </div>
  );
};
