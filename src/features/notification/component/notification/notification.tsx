import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Loader2 } from 'lucide-react';
import { MenubarContent } from 'components/ui/menubar';
import { Button } from 'components/ui/button';
import { useGetNotifications, useMarkAllNotificationAsRead } from '../../hooks/use-notification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { NotificationItem } from '../notification-item/notification-item';
import { subscribeNotifications } from '@seliseblocks/notifications';
import API_CONFIG from 'config/api';
import { useAuthStore } from 'state/store/auth';
import type { Notification as NotificationType } from '../../types/notification.types';
import { NotificationSkeletonList } from '../notification-skeleton/notification-skeleton';

const PAGE_SIZE = 10;

export function Notification() {
  const { t } = useTranslation();
  const [tabId, setTabId] = useState('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [allNotifications, setAllNotifications] = useState<NotificationType[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  const {
    data: notificationsData,
    isFetching,
    isLoading,
  } = useGetNotifications({
    Page: page,
    PageSize: PAGE_SIZE,
    IsUnreadOnly: tabId === 'unread',
    SortProperty: 'createdTime',
    SortIsDescending: true,
  });

  // Update allNotifications when new data is fetched
  useEffect(() => {
    if (notificationsData?.notifications) {
      if (page === 0) {
        setAllNotifications(notificationsData.notifications);
      } else {
        setAllNotifications((prev) => [...prev, ...notificationsData.notifications]);
      }
      // Check if we've reached the end of the list
      setHasMore(notificationsData.notifications.length === PAGE_SIZE);
    }
  }, [notificationsData, page]);

  // Reset pagination when tab changes
  useEffect(() => {
    setPage(0);
    setAllNotifications([]);
    setHasMore(true);
  }, [tabId]);

  // Handle scroll events for infinite loading
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isFetching || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // Load more when 100px from bottom

    if (isNearBottom) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  const filteredNotifications = React.useMemo(
    () =>
      tabId === 'all'
        ? allNotifications
        : allNotifications.filter((notification) => notification && !notification.isRead),
    [allNotifications, tabId]
  );

  useEffect(() => {
    let subscription: { stop: () => Promise<void> } | null = null;

    const setupNotifications = async () => {
      if (!accessToken) return;

      try {
        subscription = subscribeNotifications(
          `${API_CONFIG.baseUrl}/notification/v1/`,
          {
            projectKey: API_CONFIG.blocksKey,
            accessTokenFactory: () => accessToken,
          },
          (channel: string, message: unknown) => {
            // eslint-disable-next-line no-console
            console.log('Received notification:', { channel, message });
          }
        );
      } catch (error) {
        console.error('Failed to subscribe to notifications:', error);
      }
    };

    void setupNotifications();

    return () => {
      if (subscription?.stop) {
        void subscription.stop();
      }
    };
  }, [accessToken]);

  const { mutate: markAllAsRead, isPending } = useMarkAllNotificationAsRead();

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <MenubarContent
      sideOffset={4}
      align="center"
      className="w-screen md:w-[420px] p-0 rounded-t-none"
    >
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center justify-between px-4 pt-4 bg-background z-10">
            <h3 className="text-xl font-bold text-high-emphasis">{t('NOTIFICATIONS')}</h3>
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={isPending}>
              {isPending ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              ) : (
                <Check className="w-4 h-4 text-primary" />
              )}
              <span className="text-primary ml-1">{t('MARK_ALL_AS_READ')}</span>
            </Button>
          </div>
          <Tabs value={tabId}>
            <div className="flex items-center rounded text-base px-4 sticky top-14 bg-background z-10">
              <TabsList>
                <TabsTrigger onClick={() => setTabId('all')} value="all">
                  {t('ALL')}
                </TabsTrigger>
                <TabsTrigger onClick={() => setTabId('unread')} value="unread">
                  {t('UNREAD')}
                </TabsTrigger>
              </TabsList>
            </div>
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex flex-col border-t border-border max-h-[calc(100vh-13rem)] md:max-h-[500px] overflow-y-auto"
            >
              <TabsContent value={tabId} className="m-0">
                {isLoading && page === 0 ? (
                  <NotificationSkeletonList count={5} />
                ) : filteredNotifications.length > 0 ? (
                  <>
                    {filteredNotifications.map(
                      (notification) =>
                        notification && (
                          <NotificationItem key={notification.id} notification={notification} />
                        )
                    )}
                    {isFetching && page > 0 && <NotificationSkeletonList count={3} />}
                    {!hasMore && filteredNotifications.length > 0 && (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        {t('NO_MORE_NOTIFICATIONS')}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center p-4">
                    <p className="text-low-emphasis">{t('NO_NOTIFICATIONS')}</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </MenubarContent>
  );
}
