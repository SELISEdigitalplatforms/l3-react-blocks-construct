import { BellOff, Users } from 'lucide-react';
import { ChatContact } from '../../types/chat.types';
import { format } from 'date-fns';

export const ChatContactItem = ({
  avatarSrc,
  avatarFallback,
  name,
  lastMessage,
  date,
  isOnline = false,
  isUnread = false,
  isGroup = false,
  isMuted = false,
}: Readonly<ChatContact>) => {
  return (
    <div className="flex w-full items-center px-4 py-3 border-b border-border cursor-pointer hover:bg-neutral-50 bg-white">
      <div className="relative mr-3">
        <div
          className={`relative w-10 h-10 rounded-full flex items-center justify-center ${isGroup ? 'bg-secondary-50' : 'bg-neutral-100'}`}
        >
          {avatarSrc ? (
            <img src={avatarSrc} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : isGroup ? (
            <Users className="w-5 h-5 text-secondary" />
          ) : isMuted ? (
            <BellOff className="w-5 h-5 text-low-emphasis" />
          ) : (
            <span className="text-xs font-medium text-medium-emphasis">{avatarFallback}</span>
          )}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 block w-2.5 h-2.5 bg-success rounded-full ring-2 ring-white" />
        )}
      </div>
      <div className="flex flex-col w-[85%]">
        <div className="flex items-center justify-between w-full">
          <p
            className={`text-sm ${isUnread ? 'font-bold' : 'font-medium'} text-high-emphasis truncate`}
          >
            {name}
          </p>
          <span className="text-xs text-medium-emphasis whitespace-nowrap">
            {format(new Date(date), 'dd.MM.yyyy')}
          </span>
        </div>
        <div className="w-[60%] overflow-hidden">
          <p
            className={`text-sm ${isUnread ? 'font-bold' : 'font-medium'} text-medium-emphasis truncate`}
          >
            {lastMessage}
          </p>
        </div>
      </div>
    </div>
  );
};
