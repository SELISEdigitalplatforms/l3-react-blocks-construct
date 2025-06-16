import { EllipsisVertical, Info, Phone, Video } from 'lucide-react';
import { Separator } from 'components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { ChatContact } from '../../types/chat.types';

interface ChatUsersProps {
  contact: ChatContact;
}

export const ChatUsers = ({ contact }: ChatUsersProps) => {
  return (
    <div className="flex flex-col w-full h-full bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-12 h-12 bg-neutral-100">
              <AvatarImage src={contact.avatarSrc} alt={contact.name} />
              <AvatarFallback className="text-primary">{contact.avatarFallback}</AvatarFallback>
            </Avatar>
            {contact.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
            )}
          </div>
          <h3 className="font-bold text-high-emphasis">{contact.name}</h3>
        </div>
        <div className="flex items-center gap-4">
          <Video className="w-5 h-5 text-medium-emphasis cursor-pointer" />
          <Phone className="w-5 h-5 text-medium-emphasis cursor-pointer" />
          <Info className="w-5 h-5 text-medium-emphasis cursor-pointer" />
          <Separator orientation="vertical" className="h-5" />
          <EllipsisVertical className="w-5 h-5 text-medium-emphasis cursor-pointer" />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          <div className="text-center text-sm text-medium-emphasis py-4">
            Start of your conversation with {contact.name}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
