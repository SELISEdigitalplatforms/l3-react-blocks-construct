import { Button } from '@/components/ui-kit/button';
import { Reply, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '../../types/chat.types';
import { MessageMenu } from '../message-menu/message-menu';

export type MessageActionsProps = {
  isMe: boolean;
  msg: Message;
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
  handleOpenForwardModal: (msg: Message) => void;
  handleDeleteMessage: (id: string) => void;
  t: (key: string) => string;
};

export const MessageActions = ({
  isMe,
  msg,
  openDropdownId,
  setOpenDropdownId,
  handleOpenForwardModal,
  handleDeleteMessage,
  t,
}: Readonly<MessageActionsProps>) => {
  const actions = [
    <Button key="smile" variant="ghost" size="icon" className="h-6 w-6 p-0.5 rounded-full">
      <Smile className="w-4 h-4" />
    </Button>,
    <Button
      key="reply"
      variant="ghost"
      size="icon"
      className="h-6 w-6 p-0.5 rounded-full"
      onClick={() => handleOpenForwardModal(msg)}
    >
      <Reply className="w-4 h-4" />
    </Button>,
    <MessageMenu
      key="menu"
      msg={msg}
      openDropdownId={openDropdownId}
      setOpenDropdownId={setOpenDropdownId}
      handleOpenForwardModal={handleOpenForwardModal}
      handleDeleteMessage={handleDeleteMessage}
      t={t}
    />,
  ];

  return (
    <div
      className={cn(
        'flex items-center gap-1 transition-opacity duration-200',
        openDropdownId === msg.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      )}
    >
      {isMe ? actions.slice().reverse() : actions}
    </div>
  );
};
