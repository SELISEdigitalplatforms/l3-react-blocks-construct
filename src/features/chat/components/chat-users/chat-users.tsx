import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BellOff, EllipsisVertical, Info, Phone, Reply, Smile, Trash, Video } from 'lucide-react';
import { ChatInput } from '../chat-input/chat-input';
import { Separator } from 'components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Input } from 'components/ui/input';
import { ChatContact, Message } from '../../types/chat.types';
import { cn } from 'lib/utils';

interface ChatUsersProps {
  contact: ChatContact;
}

export const ChatUsers = ({ contact }: Readonly<ChatUsersProps>) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(contact.messages || []);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    setMessages(contact.messages || []);
  }, [contact]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: `MSG-${Date.now()}`,
      sender: 'me',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-10 h-10 bg-neutral-100">
              <AvatarImage src={contact.avatarSrc} alt={contact.name} />
              <AvatarFallback className="text-primary">{contact.avatarFallback}</AvatarFallback>
            </Avatar>
            {contact.status?.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
            )}
          </div>
          <h3 className="font-bold text-high-emphasis">{contact.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-medium-emphasis rounded-full hover:text-high-emphasis"
          >
            <Video className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-medium-emphasis rounded-full hover:text-high-emphasis"
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-medium-emphasis rounded-full hover:text-high-emphasis"
          >
            <Info className="w-5 h-5" />
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-medium-emphasis rounded-full hover:text-high-emphasis"
              >
                <EllipsisVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-40" align="end">
              <DropdownMenuItem>
                <BellOff className="w-4 h-4 mr-2 text-medium-emphasis" />
                <span>{t('MUTE_NOTIFICATIONS')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash className="w-4 h-4 mr-2 text-medium-emphasis" />
                <span>{t('DELETE')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center py-4">
          <p className="text-sm text-low-emphasis">
            Start of your conversation with {contact.name}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          {messages.map((msg) =>
            msg.sender === 'me' ? (
              <div key={msg.id} className="group flex w-full justify-end">
                <div className="flex w-[70%] gap-2 justify-end">
                  <div
                    className={cn(
                      'flex items-center gap-1 transition-opacity duration-200',
                      openDropdownId === msg.id
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    )}
                  >
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
                        <DropdownMenuItem>
                          <Reply className="w-4 h-4 mr-2" />
                          {t('FORWARD')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash className="w-4 h-4 mr-2" />
                          {t('DELETE')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0.5 rounded-full">
                      <Reply className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0.5 rounded-full">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-end">
                      <p className="text-xs text-low-emphasis">{formatTimestamp(msg.timestamp)}</p>
                    </div>
                    <div className="relative group">
                      <div className="rounded-xl px-4 py-2 bg-primary-50 rounded-tr-[2px]">
                        <p className="text-sm text-high-emphasis">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="group flex w-full justify-start">
                <div className="relative mr-3">
                  <Avatar className="w-6 h-6 bg-neutral-100">
                    <AvatarImage src={contact.avatarSrc} alt={contact.name} />
                    <AvatarFallback className="text-primary">
                      {contact.avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex w-[70%] gap-2 justify-start">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-low-emphasis">{contact.name}</p>
                      <p className="text-xs text-low-emphasis">{formatTimestamp(msg.timestamp)}</p>
                    </div>
                    <div className="relative group">
                      <div className="rounded-xl px-4 py-2 bg-surface rounded-tl-[2px]">
                        <p className="text-sm text-high-emphasis">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'flex items-center gap-1 transition-opacity duration-200',
                      openDropdownId === msg.id
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    )}
                  >
                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0.5 rounded-full">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0.5 rounded-full">
                      <Reply className="w-4 h-4" />
                    </Button>
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
                        <DropdownMenuItem>
                          <Reply className="w-4 h-4 mr-2" />
                          {t('FORWARD')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash className="w-4 h-4 mr-2" />
                          {t('DELETE')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div className="flex-none border-t border-border px-4 py-3 bg-white">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 w-full max-w-full overflow-hidden"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`${t('TYPE_MESSAGE')}...`}
            className="border-0 rounded-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full min-w-[100px] shadow-none"
          />
          <ChatInput />
        </form>
      </div>
    </div>
  );
};
