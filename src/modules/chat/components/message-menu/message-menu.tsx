import { Button } from '@/components/ui-kit/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui-kit/dropdown-menu';
import { EllipsisVertical, Reply, Trash } from 'lucide-react';
import type { Message } from '../../types/chat.types';

export type MessageMenuProps = {
  msg: Message;
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
  handleOpenForwardModal: (msg: Message) => void;
  handleDeleteMessage: (id: string) => void;
  t: (key: string) => string;
};

export const MessageMenu = ({
  msg,
  openDropdownId,
  setOpenDropdownId,
  handleOpenForwardModal,
  handleDeleteMessage,
  t,
}: Readonly<MessageMenuProps>) => (
  <DropdownMenu
    open={openDropdownId === msg.id}
    onOpenChange={(open) => setOpenDropdownId(open ? msg.id : null)}
  >
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-6 w-6 p-0.5 rounded-full">
        <EllipsisVertical className="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-40" align="end">
      <DropdownMenuItem
        onClick={() => handleOpenForwardModal(msg)}
        data-testid={`msg-${msg.id}-forward-btn`}
      >
        <Reply className="w-4 h-4 mr-2" />
        {t('FORWARD')}
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => handleDeleteMessage(msg.id)}
        data-testid={`msg-${msg.id}-delete-btn`}
      >
        <Trash className="w-4 h-4 mr-2" />
        {t('DELETE')}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
