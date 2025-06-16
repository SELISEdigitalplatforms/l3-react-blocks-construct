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
import { cn } from 'lib/utils';

interface ChatContactItemProps extends ChatContact {
  onClick?: (contact: ChatContact) => void;
  isSelected?: boolean;
}

export const ChatContactItem = ({
  id,
  avatarSrc,
  avatarFallback,
  name,
  email,
  lastMessage,
  date,
  status,
  messages,
  onClick,
  isSelected = false,
}: Readonly<ChatContactItemProps>) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();

  const handleClick = () => {
    if (onClick) {
      onClick({
        id,
        avatarSrc,
        avatarFallback,
        name,
        email: email ?? '',
        lastMessage,
        date,
        status,
        messages,
      });
    }
  };

  const showIcon = isHovered || isDropdownOpen;

  return (
    <button
      type="button"
      className={cn(
        'relative flex w-full items-center px-4 py-3 border-b border-border cursor-pointer hover:bg-neutral-50 bg-white last:border-b-0 text-left',
        isSelected && 'bg-primary-50 hover:bg-primary-50'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative mr-3 flex-shrink-0">
        <div
          className={cn(
            'relative w-10 h-10 rounded-full flex items-center justify-center',
            status?.isGroup ? 'bg-secondary-50' : 'bg-neutral-100'
          )}
        >
          {avatarSrc ? (
            <img src={avatarSrc} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : status?.isGroup ? (
            <Users className="w-5 h-5 text-secondary" />
          ) : status?.isMuted ? (
            <BellOff className="w-5 h-5 text-low-emphasis" />
          ) : (
            <span className="text-xs font-medium text-medium-emphasis">{avatarFallback}</span>
          )}
        </div>
        {status?.isOnline && (
          <div className="absolute bottom-0 right-0 block w-2.5 h-2.5 bg-success rounded-full ring-2 ring-white" />
        )}
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center justify-between w-full">
          <p
            className={cn(
              'text-sm text-high-emphasis truncate',
              status?.isUnread ? 'font-bold' : 'font-medium'
            )}
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
            className={cn(
              'text-sm text-medium-emphasis truncate',
              status?.isUnread ? 'font-bold' : 'font-medium'
            )}
          >
            {lastMessage}
          </p>
        </div>
      </div>

      <div className="absolute right-4 top-0">
        <DropdownMenu open={isDropdownOpen} onOpenChange={(open) => setIsDropdownOpen(open)}>
          <DropdownMenuTrigger asChild>
            <div
              className={cn(
                'cursor-pointer transition-opacity duration-200 pt-3 px-2',
                showIcon ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}
            >
              <EllipsisVertical className="w-4 h-4 text-medium-emphasis hover:text-high-emphasis" />
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
    </button>
  );
};
