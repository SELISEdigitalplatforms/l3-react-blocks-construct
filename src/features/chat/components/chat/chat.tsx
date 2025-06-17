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
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId ? { ...contact, name: newName } : contact
      )
    );

    if (selectedContact?.id === contactId) {
      setSelectedContact((prev) => (prev ? { ...prev, name: newName } : null));
    }
  };

  const updateContactStatus = (contactId: string, updates: Partial<ChatContact['status']>) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              status: {
                ...contact.status,
                ...updates,
              },
            }
          : contact
      )
    );

    if (selectedContact?.id === contactId) {
      setSelectedContact((prev) =>
        prev
          ? {
              ...prev,
              status: {
                ...prev.status,
                ...updates,
              },
            }
          : null
      );
    }
  };

  const handleMarkContactAsRead = (contactId: string) => {
    updateContactStatus(contactId, { isUnread: false });
  };

  const handleMarkContactAsUnread = (contactId: string) => {
    updateContactStatus(contactId, { isUnread: true });
  };

  const handleMuteToggle = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId);

    if (contact) {
      // Ensure status object exists and toggle isMuted
      const currentIsMuted = contact.status?.isMuted || false;
      updateContactStatus(contactId, {
        ...contact.status, // Preserve other status properties
        isMuted: !currentIsMuted,
      });
    }
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== contactId));
    if (selectedContact?.id === contactId) {
      setSelectedContact(null);
    }
  };

  const handleDeleteMember = (contactId: string, memberId: string) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              members: contact.members?.filter((member) => member.id !== memberId) || [],
            }
          : contact
      )
    );

    if (selectedContact?.id === contactId) {
      setSelectedContact((prev) =>
        prev
          ? {
              ...prev,
              members: prev.members?.filter((member) => member.id !== memberId) || [],
            }
          : null
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <div className="flex h-[calc(100dvh-124px)] w-full bg-white rounded-lg shadow-sm">
        <ChatSidebar
          contacts={contacts}
          selectedContactId={selectedContact?.id}
          onEditClick={() => setShowChatSearch(true)}
          isSearchActive={showChatSearch}
          onDiscardClick={() => setShowChatSearch(false)}
          onContactSelect={(contact) => {
            if (contact.status?.isUnread) {
              handleMarkContactAsRead(contact.id);
            }
            setSelectedContact(contact);
            setShowChatSearch(false);
          }}
          onMarkAsRead={handleMarkContactAsRead}
          onMarkAsUnread={handleMarkContactAsUnread}
          onMuteToggle={handleMuteToggle}
          onDeleteContact={handleDeleteContact}
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
              onMuteToggle={handleMuteToggle}
              onDeleteContact={handleDeleteContact}
              onDeleteMember={handleDeleteMember}
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
