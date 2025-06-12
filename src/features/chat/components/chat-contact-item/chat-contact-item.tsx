import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { cn } from 'lib/utils';

interface ChatContactItemProps {
  avatarSrc: string;
  avatarFallback: string;
  name: string;
  lastMessage: string;
  date: string;
  isOnline?: boolean;
  isNotification?: boolean;
}

export const ChatContactItem = ({
  avatarSrc,
  avatarFallback,
  name,
  lastMessage,
  date,
  isOnline = false,
  isNotification = false,
}: ChatContactItemProps) => {
  return (
    <div
      className={cn(
        'flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer',
        'hover:bg-gray-50 transition-colors duration-150',
        isNotification ? 'bg-blue-50' : 'bg-white'
      )}
      tabIndex={0}
      aria-label={`Chat with ${name}`}
    >
      <div className="relative flex-shrink-0 mr-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback className="text-xs font-medium text-gray-600 bg-gray-100">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white"></span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          <span className="ml-2 text-xs text-gray-500 whitespace-nowrap">{date}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 truncate max-w-[220px]">{lastMessage}</p>
          {isNotification && (
            <span className="flex-shrink-0 w-2 h-2 ml-2 rounded-full bg-blue-600"></span>
          )}
        </div>
      </div>
    </div>
  );
};
