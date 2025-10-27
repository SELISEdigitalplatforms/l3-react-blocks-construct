import { Menu, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui-kit/button';
import type { ChatContact } from '../../types/chat.types';

export interface ChatHeaderProps {
  selectedContact: ChatContact | null;
  onMenuClick: () => void;
  onInfoClick: () => void;
  showBackButton: boolean;
}

export const ChatHeader = ({
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
