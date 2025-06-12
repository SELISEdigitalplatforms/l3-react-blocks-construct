import { Search, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Input } from 'components/ui/input';
import { ChatContactItem } from '../chat-contact-item/chat-contact-item';
import { mockChatContacts, mockUserProfile } from '../../data/chat.data';

export const ChatSidebar = () => {
  const { t } = useTranslation();
  return (
    <div className="w-[400px] min-w-[400px] border-r border-border bg-white flex flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={mockUserProfile.avatarSrc} alt="sidebar avatar" />
            <AvatarFallback>{mockUserProfile.avatarFallback}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-high-emphasis">{mockUserProfile.name}</p>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 mr-1.5 rounded-full bg-success" />
              <span className="text-xs text-medium-emphasis">
                {mockUserProfile.isOnline ? t('ONLINE') : t('OFFLINE')}
              </span>
            </div>
          </div>
        </div>
        <button
          className="p-1.5 text-medium-emphasis rounded-full hover:bg-gray-100 hover:text-gray-500"
          aria-label="Edit profile"
        >
          <Edit className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3">
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
      <div className="flex-1 overflow-y-auto">
        {mockChatContacts.map((contact) => (
          <ChatContactItem key={contact.id} {...contact} />
        ))}
      </div>
    </div>
  );
};
