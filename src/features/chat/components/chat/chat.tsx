import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ChatStateContent } from '../chat-state-content/chat-state-content';
import { ChatSidebar } from '../chat-sidebar/chat-sidebar';
import { ChatSearch } from '../chat-search/chat-search';

export const Chat = () => {
  const { t } = useTranslation();
  const [showChatSearch, setShowChatSearch] = useState(false);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="hidden md:block w-full border-b border-border">
        <div className="flex bg-white ">
          <div className="p-4 transition-all duration-300 md:min-w-[399px]">
            <h2 className="text-2xl font-bold tracking-tight">{t('CHAT')}</h2>
          </div>
          <div className="flex border-l items-center w-full px-4 py-3">
            <Menu className="w-6 h-6 text-medium-emphasis cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="flex w-full h-full bg-white rounded-lg shadow-sm overflow-hidden">
        <ChatSidebar onEditClick={() => setShowChatSearch(true)} />
        <div className="flex flex-col w-full h-full">
          {showChatSearch && <ChatSearch onClose={() => setShowChatSearch(false)} />}
          <ChatStateContent
            isSearchActive={showChatSearch}
            onStartNewConversation={() => setShowChatSearch(true)}
          />
        </div>
      </div>
    </div>
  );
};
