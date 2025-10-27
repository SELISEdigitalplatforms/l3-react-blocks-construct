import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Loader2 } from 'lucide-react';
import { MenubarContent } from '@/components/ui-kit/menubar';
import { Button } from '@/components/ui-kit/button';
import { useGetNotifications, useMarkAllNotificationAsRead } from '../../hooks/use-notification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui-kit/tabs';
import { NotificationItem } from '../notification-item/notification-item';
import { subscribeNotifications } from '@seliseblocks/notifications';
import API_CONFIG from '@/config/api';
import { useAuthStore } from '@/state/store/auth';
import type { Notification as NotificationType } from '../../types/notification.types';
import { NotificationSkeletonList } from '../notification-skeleton/notification-skeleton';

const PAGE_SIZE = 10;

export const Notification = () => {
  const { t } = useTranslation();
  const [tabId, setTabId] = useState('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [tabData, setTabData] = useState<{
    all: NotificationType[];
    unread: NotificationType[];
  }>({ all: [], unread: [] });
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);

  const currentTabNotifications = React.useMemo(() => {
    return tabData[tabId as keyof typeof tabData] || [];
  }, [tabData, tabId]);

  const {
    data: notificationsData,
    isFetching,
    isLoading,
    refetch,
  } = useGetNotifications({
    Page: page,
    PageSize: PAGE_SIZE,
    IsUnreadOnly: tabId === 'unread',
    SortProperty: 'createdTime',
    SortIsDescending: true,
  });

  const isAllNotificationsRead = useMemo(() => {
    return tabData.all.every((notification) => notification.isRead);
  }, [tabData.all]);

  const updateTabData = useCallback(
    (prev: { all: NotificationType[]; unread: NotificationType[] }) => {
      if (!notificationsData?.notifications) return prev;

      if (page === 0) {
        return {
          ...prev,
          [tabId]: notificationsData.notifications,
        };
      }

      if (notificationsData.notifications.length === 0) {
        setHasMore(false);
        return prev;
      }

      const newData = [
        ...(prev[tabId as keyof typeof prev] || []),
        ...notificationsData.notifications,
      ];

      const uniqueData = newData.filter(
        (notification, index, self) => index === self.findIndex((n) => n.id === notification.id)
      );

      return {
        ...prev,
        [tabId]: uniqueData,
      };
    },
    [notificationsData, page, tabId]
  );

  useEffect(() => {
    if (!notificationsData) return;

    if (notificationsData.notifications) {
      setTabData(updateTabData);
      setHasMore(notificationsData.notifications.length === PAGE_SIZE);
    } else if (page > 0) {
      setHasMore(false);
    }

    setIsLoadingMore(false);
  }, [notificationsData, page, tabId, updateTabData]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setIsLoadingMore(false);
    void refetch();
  }, [tabId, refetch]);

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container || isFetching || !hasMore || isLoadingMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isNearBottom && hasMore) {
        setIsLoadingMore(true);
        setPage((prev) => {
          const nextPage = prev + 1;
          return nextPage;
        });
      }
    }, 150);
  }, [isFetching, hasMore, isLoadingMore]);

  const filteredNotifications = React.useMemo(() => {
    return currentTabNotifications.filter(
      (notification) => tabId === 'all' || !notification.isRead
    );
  }, [currentTabNotifications, tabId]);

  const renderNotificationContent = () => {
    if ((isLoading && page === 0) || isMarkingAllAsRead) {
      return <NotificationSkeletonList count={Math.min(5, currentTabNotifications.length || 5)} />;
    }

    if (filteredNotifications.length > 0) {
      return (
        <>
          {filteredNotifications.map(
            (notification) =>
              notification && <NotificationItem key={notification.id} notification={notification} />
          )}
          {(isFetching || isLoadingMore) && page > 0 && <NotificationSkeletonList count={3} />}
          {!hasMore && filteredNotifications.length > 0 && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              {t('NO_MORE_NOTIFICATIONS')}
            </div>
          )}
        </>
      );
    }

    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-low-emphasis">{t('NO_NOTIFICATIONS')}</p>
      </div>
    );
  };

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

  const { mutate: markAllAsRead, isPending } = useMarkAllNotificationAsRead({
    onSuccess: () => {
      setTabData((prev) => ({
        all: prev.all.map((n) => ({ ...n, isRead: true })),
        unread: [],
      }));
      setPage(0);
      setHasMore(true);
      setIsMarkingAllAsRead(false);
      void refetch();
    },
  });

  const handleMarkAllAsRead = () => {
    setIsMarkingAllAsRead(true);
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isPending || isAllNotificationsRead}
            >
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
                {renderNotificationContent()}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </MenubarContent>
  );
};
