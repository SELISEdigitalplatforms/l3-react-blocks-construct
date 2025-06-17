import { useState } from 'react';
import { ChatStateContent } from '../chat-state-content/chat-state-content';
import { ChatSidebar } from '../chat-sidebar/chat-sidebar';
import { ChatSearch } from '../chat-search/chat-search';
import { ChatUsers } from '../chat-users/chat-users';
import { ChatContact } from '../../types/chat.types';
import { ChatHeader } from '../chat-header/chat-header';
import { mockChatContacts } from '../../data/chat.data';

export const Chat = () => {
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [contacts, setContacts] = useState<ChatContact[]>(mockChatContacts);

  const handleContactNameUpdate = (contactId: string, newName: string) => {
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === contactId ? { ...contact, name: newName } : contact
      )
    );
    
    // Update the selected contact if it's the one being edited
    if (selectedContact?.id === contactId) {
      setSelectedContact(prev => prev ? { ...prev, name: newName } : null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <div className="flex h-[calc(100dvh-124px)] w-full bg-white rounded-lg shadow-sm">
        <ChatSidebar
          contacts={contacts}
          onEditClick={() => setShowChatSearch(true)}
          isSearchActive={showChatSearch}
          onDiscardClick={() => setShowChatSearch(false)}
          onContactSelect={(contact) => {
            setSelectedContact(contact);
            setShowChatSearch(false);
          }}
        />
        <div className="flex flex-col w-full">
          {showChatSearch ? (
            <ChatSearch
              onClose={() => setShowChatSearch(false)}
              onSelectContact={setSelectedContact}
            />
          ) : selectedContact ? (
            <ChatUsers 
              contact={selectedContact} 
              onContactNameUpdate={handleContactNameUpdate}
            />
          ) : (
            <ChatStateContent
              isSearchActive={false}
              onStartNewConversation={() => setShowChatSearch(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
