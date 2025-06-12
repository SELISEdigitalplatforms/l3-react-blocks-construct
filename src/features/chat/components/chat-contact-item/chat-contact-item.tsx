import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { cn } from 'lib/utils';
import { ChatContact } from '../../types/chat.types';

export const ChatContactItem = ({
  avatarSrc,
  avatarFallback,
  name,
  lastMessage,
  date,
  isOnline = false,
  isUnread = false,
}: ChatContact) => {
  return (
    <div
      className={cn(
        'flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer',
        'hover:bg-gray-50 transition-colors duration-150 bg-white'
      )}
      tabIndex={0}
      aria-label={`Chat with ${name}`}
    >
      <div className="relative flex-shrink-0 mr-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback className="text-xs font-medium text-medium-emphasis bg-surface">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 bg-success rounded-full ring-2 ring-white" />
        )}
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between">
          <p
            className={`text-sm ${isUnread ? 'font-bold' : 'font-medium'} text-high-emphasis truncate`}
          >
            {name}
          </p>
          <span className="text-xs text-medium-emphasis whitespace-nowrap">{date}</span>
        </div>
        <p
          className={`text-sm ${isUnread ? 'font-bold' : 'font-medium'} text-medium-emphasis truncate max-w-[220px]`}
        >
          {lastMessage}
        </p>
      </div>
    </div>
  );
};
