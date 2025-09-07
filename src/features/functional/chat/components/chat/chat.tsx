import { useState, useEffect } from 'react';
import { Menu, ArrowLeft } from 'lucide-react';
import { Button } from 'components/ui/button';
import { ChatStateContent } from '../chat-state-content/chat-state-content';
import { ChatSidebar } from '../chat-sidebar/chat-sidebar';
import { ChatSearch } from '../chat-search/chat-search';
import { ChatUsers } from '../chat-users/chat-users';
import { ChatContact } from '../../types/chat.types';
import { mockChatContacts } from '../../data/chat.data';
import { Sheet, SheetContent } from 'components/ui/sheet';
import { ChatProfile } from '../chat-profile/chat-profile';
import { Dialog, DialogContent, DialogHeader } from 'components/ui/dialog';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

export const Chat = () => {
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [contacts, setContacts] = useState<ChatContact[]>(mockChatContacts);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat' | 'search'>('list');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile && selectedContact) {
      setMobileView('chat');
    } else if (isMobile) {
      setMobileView('list');
    }
  }, [selectedContact, isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileView(mobileView === 'list' ? 'chat' : 'list');
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleContactSelect = (contact: ChatContact) => {
    if (contact.status?.isUnread) {
      handleMarkContactAsRead(contact.id);
    }
    setSelectedContact(contact);
    setShowChatSearch(false);
    if (isMobile) {
      setMobileView('chat');
    }
  };

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
      const currentIsMuted = contact.status?.isMuted || false;
      updateContactStatus(contactId, {
        ...contact.status,
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

  const removeMemberFromContact = (contact: any, memberId: string) => ({
    ...contact,
    members: contact.members?.filter((member: any) => member.id !== memberId) || [],
  });

  const handleDeleteMember = (contactId: string, memberId: string) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId ? removeMemberFromContact(contact, memberId) : contact
      )
    );

    if (selectedContact?.id === contactId) {
      setSelectedContact((prev) => (prev ? removeMemberFromContact(prev, memberId) : null));
    }
  };

  const handleLeaveGroup = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    const me = contact?.members?.find((m) => m.isMe);

    if (!contact || !me) {
      return;
    }

    handleDeleteMember(contactId, me.id);

    if (selectedContact?.id === contactId) {
      setSelectedContact(null);
      if (isMobile) {
        setMobileView('list');
      }
    }
  };

  const handleEditClick = () => {
    setShowChatSearch(true);
    if (isMobile) setMobileView('search');
  };

  const renderContent = () => {
    if (!isMobile) {
      return (
        <>
          <ChatSidebar
            isCollapsed={isSidebarCollapsed}
            contacts={contacts}
            selectedContactId={selectedContact?.id}
            onEditClick={handleEditClick}
            isSearchActive={showChatSearch}
            onDiscardClick={() => setShowChatSearch(false)}
            onContactSelect={handleContactSelect}
            onMarkAsRead={handleMarkContactAsRead}
            onMarkAsUnread={handleMarkContactAsUnread}
            onMuteToggle={handleMuteToggle}
            onDeleteContact={handleDeleteContact}
          />
          <div
            className={`flex flex-col w-full ${!selectedContact ? 'h-full' : 'h-[calc(100dvh-118px)]'}`}
          >
            <ChatHeader
              selectedContact={selectedContact}
              onMenuClick={toggleSidebar}
              showBackButton={false}
            />
            <div className="flex flex-col w-full h-full">{renderMainContent()}</div>
          </div>
        </>
      );
    }

    if (mobileView === 'list') {
      return (
        <div className="w-full h-full">
          <ChatSidebar
            isCollapsed={false}
            contacts={contacts}
            selectedContactId={selectedContact?.id}
            onEditClick={handleEditClick}
            isSearchActive={showChatSearch}
            onDiscardClick={() => setShowChatSearch(false)}
            onContactSelect={handleContactSelect}
            onMarkAsRead={handleMarkContactAsRead}
            onMarkAsUnread={handleMarkContactAsUnread}
            onMuteToggle={handleMuteToggle}
            onDeleteContact={handleDeleteContact}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col w-full h-full">
        <ChatHeader
          selectedContact={selectedContact}
          onMenuClick={() => setMobileView('list')}
          showBackButton={true}
        />
        <div className="flex-1 overflow-y-auto">{renderMainContent()}</div>
      </div>
    );
  };

  const renderMainContent = () => {
    if (showChatSearch) {
      if (isMobile) {
        return (
          <Dialog open={showChatSearch} onOpenChange={setShowChatSearch}>
            <DialogContent hideClose className="p-0 max-w-full w-full h-full">
              <DialogHeader className="hidden">
                <DialogTitle />
                <DialogDescription />
              </DialogHeader>
              <ChatSearch
                onClose={() => setShowChatSearch(false)}
                onSelectContact={handleContactSelect}
              />
            </DialogContent>
          </Dialog>
        );
      }
      return (
        <ChatSearch
          onClose={() => setShowChatSearch(false)}
          onSelectContact={handleContactSelect}
        />
      );
    }

    if (selectedContact) {
      return (
        <ChatUsers
          contact={selectedContact}
          onContactNameUpdate={handleContactNameUpdate}
          onMuteToggle={handleMuteToggle}
          onDeleteContact={handleDeleteContact}
          onDeleteMember={handleDeleteMember}
          onLeaveGroup={handleLeaveGroup}
          hideProfile={isMobile}
          onOpenProfileSheet={isMobile ? () => setShowProfileSheet(true) : undefined}
        />
      );
    }

    return (
      <ChatStateContent
        isSearchActive={false}
        onStartNewConversation={() => setShowChatSearch(true)}
      />
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex h-[calc(100dvh-57px)] w-full bg-white rounded-lg shadow-sm">
        {renderContent()}

        {selectedContact && (
          <Sheet open={showProfileSheet} onOpenChange={setShowProfileSheet}>
            <SheetContent side="right" className="w-full max-w-md p-0 overflow-y-auto">
              <ChatProfile
                contact={selectedContact}
                onGroupNameUpdate={(newName) =>
                  handleContactNameUpdate(selectedContact.id, newName)
                }
                onMuteToggle={() => handleMuteToggle(selectedContact.id)}
                onDeleteMember={handleDeleteMember}
                onLeaveGroup={handleLeaveGroup}
              />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};

interface ChatHeaderProps {
  selectedContact: ChatContact | null;
  onMenuClick: () => void;
  onInfoClick: () => void;
  showBackButton: boolean;
}

const ChatHeader = ({
  selectedContact,
  onMenuClick,
  showBackButton,
}: Omit<ChatHeaderProps, 'onInfoClick'>) => (
  <div className="flex items-center w-full min-h-[65px] px-4 border-b border-border">
    <Button variant="ghost" size="icon" className="rounded-full" onClick={onMenuClick}>
      {showBackButton ? (
        <ArrowLeft className="w-6 h-6 text-medium-emphasis" />
      ) : (
        <Menu className="w-6 h-6 text-medium-emphasis" />
      )}
    </Button>

    {selectedContact && (
      <h2 className="lg:hidden text-lg font-semibold ml-3">{selectedContact.name}</h2>
    )}
  </div>
);
