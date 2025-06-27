import { useState } from 'react';
import { EllipsisVertical, Loader2 } from 'lucide-react';
import { parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import { useMarkNotificationAsRead } from '../../hooks/use-notification';
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
  const [isRead, setIsRead] = useState(notification.isRead);
  const { mutate: markAsRead, isPending } = useMarkNotificationAsRead();

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isRead) {
      setIsRead(true);
      markAsRead(notification.id, {
        onError: () => {
          setIsRead(false);
        },
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    const now = new Date();

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const timeString = timeFormatter.format(date);

    if (date.toDateString() === now.toDateString()) {
      return `${t('TODAY')}, ${timeString}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `${t('YESTERDAY')}, ${timeString}`;
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}, ${timeString}`;
  };

  return (
    <div className="border-b border-border last:border-b-0">
      <div className="group flex items-start gap-3 p-2 hover:bg-muted/50 transition-colors cursor-pointer">
        <div className={`w-2 h-2 rounded-full mt-3 ${!isRead && 'bg-secondary'}`} />
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-1">
            <h4 className={`text-high-emphasis truncate text-base ${!isRead && 'font-bold'}`}>
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
                <DropdownMenuItem
                  onClick={handleMarkAsRead}
                  disabled={isRead || isPending}
                  className="flex items-center gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('MARKING_AS_READ')}</span>
                    </>
                  ) : (
                    <span>{t('MARK_AS_READ')}</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem disabled>{t('REMOVE_NOTIFICATION')}</DropdownMenuItem>
                <DropdownMenuItem disabled>{t('TURN_OFF_NOTIFICATION_MODULE')}</DropdownMenuItem>
              </DropdownMenuContent>
            </div>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
