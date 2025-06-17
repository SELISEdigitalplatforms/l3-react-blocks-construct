import { useTranslation } from 'react-i18next';
import {
  BellOff,
  EllipsisVertical,
  Info,
  Mic,
  Paperclip,
  Phone,
  Send,
  Smile,
  Trash,
  Video,
} from 'lucide-react';
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
import { useState, useEffect } from 'react';

interface ChatUsersProps {
  contact: ChatContact;
}

export const ChatUsers = ({ contact }: ChatUsersProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(contact.messages || []);

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
      <div className="flex-none flex items-center justify-between px-6 py-4 border-b border-border">
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

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center py-4">
          <p className="text-sm text-medium-emphasis">
            Start of your conversation with {contact.name}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex', msg.sender === 'me' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[70%] rounded-2xl px-4 py-2',
                  msg.sender === 'me'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted rounded-bl-none'
                )}
              >
                <p>{msg.content}</p>
                <p
                  className={cn(
                    'text-xs mt-1',
                    msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground',
                    'text-right'
                  )}
                >
                  {formatTimestamp(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="flex-none border-t border-border p-4 bg-white">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 w-full max-w-full overflow-hidden"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-medium-emphasis rounded-full hover:text-high-emphasis"
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="min-w-0 flex-1"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-medium-emphasis rounded-full hover:text-high-emphasis"
          >
            <Smile className="w-5 h-5" />
          </Button>

          {message ? (
            <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
              <Send className="w-5 h-5 text-white" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-medium-emphasis rounded-full hover:text-high-emphasis"
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};
