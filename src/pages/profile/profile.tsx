import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { DevicesTable, GeneralInfo } from 'features/profile';

export function Profile() {
  const [tabId, setTabId] = useState('generalInfo');

  return (
    <div className="flex w-full flex-col">
      <div className="mb-2 md:mb-[18px] flex items-center text-base text-high-emphasis">
        <h3 className="text-2xl font-bold tracking-tight">My Profile</h3>
      </div>

      <Tabs value={tabId}>
        <div className="my-3 sm:my-5 flex items-center rounded text-base">
          <TabsList>
            <TabsTrigger onClick={() => setTabId('generalInfo')} value="generalInfo">
              General info
            </TabsTrigger>
            <TabsTrigger onClick={() => setTabId('devices')} value="devices">
              Devices
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="generalInfo">
          <GeneralInfo />
        </TabsContent>

        <TabsContent value="devices">
          <DevicesTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
