import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { BellOff, EllipsisVertical, MailOpen, Trash, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { ChatContact } from '../../types/chat.types';

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
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();

  const showIcon = isHovered || isDropdownOpen;

  return (
    <div
      className="relative flex w-full items-center px-4 py-3 border-b border-border cursor-pointer hover:bg-neutral-50 bg-white last:border-b-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mr-3 flex-shrink-0">
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

      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center justify-between w-full">
          <p
            className={`text-sm ${isUnread ? 'font-bold' : 'font-medium'} text-high-emphasis truncate`}
          >
            {name}
          </p>

          {!showIcon && (
            <span className="text-xs text-medium-emphasis whitespace-nowrap">
              {format(new Date(date), 'dd.MM.yyyy')}
            </span>
          )}
        </div>
        <div className="w-full overflow-hidden">
          <p
            className={`text-sm ${isUnread ? 'font-bold' : 'font-medium'} text-medium-emphasis truncate`}
          >
            {lastMessage}
          </p>
        </div>
      </div>

      <div className="absolute right-4 top-0">
        <DropdownMenu open={isDropdownOpen} onOpenChange={(open) => setIsDropdownOpen(open)}>
          <DropdownMenuTrigger asChild>
            <div
              className={`cursor-pointer transition-opacity duration-200 p-2 ${
                showIcon ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <EllipsisVertical className="w-4 h-4 text-medium-emphasis" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-40" align="end">
            <DropdownMenuItem>
              <MailOpen className="w-5 h-5 mr-1 text-medium-emphasis" />
              {t('MARK_AS_UNREAD')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BellOff className="w-5 h-5 mr-1 text-medium-emphasis" />
              {t('MUTE_NOTIFICATIONS')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash className="w-5 h-5 mr-1 text-medium-emphasis" />
              {t('DELETE')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
