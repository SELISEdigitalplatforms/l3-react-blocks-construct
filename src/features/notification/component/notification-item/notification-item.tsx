import { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import type { Notification } from '../../types/notification.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: Readonly<NotificationItemProps>) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="border-b border-border last:border-b-0">
      <div className="group flex items-start gap-3 p-2 hover:bg-muted/50 transition-colors cursor-pointer">
        <div className={`w-2 h-2 rounded-full mt-3 ${!notification.isRead && 'bg-secondary'}`} />
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-1">
            <h4
              className={`text-high-emphasis truncate text-base ${!notification.isRead && 'font-bold'}`}
            >
              {notification.payload.notificationType}
            </h4>
            <p className="text-high-emphasis text-sm line-clamp-2">
              {notification.payload.responseValue}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-medium-emphasis">
                {formatDate(notification.createdTime)}
              </span>
              {/* TODO FE: Might need to binding later */}
              {/* <div className="w-[6px] h-[6px] rounded-full bg-neutral-200" />
              <span className="text-xs text-medium-emphasis">IAM</span> */}
            </div>
          </div>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <div
              className={`${isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                  <EllipsisVertical className="!w-5 !h-5 text-medium-emphasis" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>{t('MARK_AS_READ')}</DropdownMenuItem>
                <DropdownMenuItem disabled>{t('REMOVE_NOTIFICATION')}</DropdownMenuItem>
                <DropdownMenuItem>{t('TURN_OFF_NOTIFICATION_MODULE')}</DropdownMenuItem>
              </DropdownMenuContent>
            </div>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
