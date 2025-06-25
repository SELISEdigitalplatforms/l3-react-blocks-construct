import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { MenubarContent } from 'components/ui/menubar';
import { Button } from 'components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { NotificationItem } from '../notification-item/notification-item';
import { notifications } from '../../data/notifications.data';

export function Notification() {
  const { t } = useTranslation();
  const [tabId, setTabId] = useState('all');

  const filteredNotifications =
    tabId === 'all' ? notifications : notifications.filter((notification) => notification.isUnread);

  return (
    <MenubarContent align="center" className="w-screen md:w-[420px] p-0">
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center justify-between px-4 pt-4 bg-background z-10">
            <h3 className="text-xl font-bold text-high-emphasis">{t('NOTIFICATIONS')}</h3>
            <Button variant="ghost" size="sm">
              <Check className="w-4 h-4 text-primary" />
              <span className="text-primary">{t('MARK_ALL_AS_READ')}</span>
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
            <div className="flex flex-col border-t border-border max-h-[calc(100vh-13rem)] md:max-h-[500px] overflow-y-auto">
              <TabsContent value={tabId} className="m-0">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.notificationId}
                      notification={notification}
                    />
                  ))
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
