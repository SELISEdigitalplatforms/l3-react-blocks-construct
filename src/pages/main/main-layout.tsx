import { Bell, Library } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from 'components/blocks/layout/app-sidebar';
import { UProfileMenu } from 'components/blocks/u-profile-menu';
import { SidebarProvider, SidebarTrigger } from 'components/ui/sidebar';
import LanguageSelector from 'components/blocks/language-selector/language-selector';
import { Button } from 'components/ui/button';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1">
          <div className="border-b py-2 px-8 flex justify-between items-center w-full">
            <SidebarTrigger />
            <div className="flex justify-between items-center gap-1 sm:gap-8">
              <Button variant="ghost" size="icon">
                <Library className="!w-5 !h-5 text-medium-emphasis" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="!w-5 !h-5 text-medium-emphasis" />
              </Button>
              <LanguageSelector />
              <div className="border-l border-gray-300 h-4"></div>
              <UProfileMenu />
            </div>
          </div>
          <div className="bg-surface p-8 min-h-screen">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
