import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sidebar, SidebarContent, SidebarHeader, useSidebar } from '@/components/ui-kit/sidebar';
import { useTheme } from '@/styles/theme/theme-provider';
import { getSidebarStyle } from '@/utils/sidebar-utils';
import { useFilteredMenu } from '@/hooks/use-filtered-menu';
import { LogoSection, MenuSection } from '@/components/core';
import { menuItems } from '@/constant/sidebar-menu';

/**
 * AppSidebar Component
 *
 * A responsive, collapsible sidebar navigation component that displays application menu items
 * organized into integrated and design-only categories.
 *
 * Features:
 * - Collapsible sidebar with smooth transition animations
 * - Different logos for expanded and collapsed states
 * - Auto-collapses on mobile when route changes
 * - Separates menu items into categorized sections
 * - Highlights active navigation items based on current route
 * - Supports both icon-only and icon-with-text display modes
 *
 * Dependencies:
 * - Requires useSidebar context for controlling sidebar state
 * - Uses React Router's useLocation for active item highlighting
 * - Consumes menuItems data structure for navigation options
 * - Uses custom SidebarMenuItemComponent for rendering individual menu items
 *
 * @example
 * // Basic usage in layout component
 * <AppLayout>
 *   <AppSidebar />
 *   <MainContent />
 * </AppLayout>
 *
 * // With SidebarProvider
 * <SidebarProvider>
 *   <AppLayout>
 *     <AppSidebar />
 *     <MainContent />
 *   </AppLayout>
 * </SidebarProvider>
 */

export const AppSidebar = () => {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { setOpenMobile, open, isMobile, openMobile } = useSidebar();

  const filteredMenuItems = useFilteredMenu(menuItems);

  const integratedMenuItems = filteredMenuItems.filter((item) => item.isIntegrated === true);
  const designOnlyMenuItems = filteredMenuItems.filter((item) => item.isIntegrated !== true);

  useEffect(() => {
    if (!isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, setOpenMobile, isMobile]);

  const sidebarStyle = getSidebarStyle(isMobile, open, openMobile);

  if (isMobile && !openMobile) {
    return null;
  }

  return (
    <Sidebar
      className={`bg-card h-full ${isMobile ? 'mobile-sidebar' : ''}`}
      collapsible={isMobile ? 'none' : 'icon'}
      style={sidebarStyle}
    >
      <SidebarHeader className={`${!open && !isMobile ? 'border-b' : ''} p-2`}>
        <LogoSection
          theme={theme}
          open={open}
          isMobile={isMobile}
          onClose={() => setOpenMobile(false)}
        />
      </SidebarHeader>

      <SidebarContent className="text-base ml-4 mr-2 my-3 text-high-emphasis font-normal overflow-x-hidden">
        <MenuSection
          title={t('CLOUD_INTEGRATED')}
          items={integratedMenuItems}
          showText={open || isMobile}
          pathname={pathname}
          onItemClick={isMobile ? () => setOpenMobile(false) : undefined}
        />

        <MenuSection
          title={t('DESIGN_ONLY')}
          items={designOnlyMenuItems}
          showText={open || isMobile}
          pathname={pathname}
          onItemClick={isMobile ? () => setOpenMobile(false) : undefined}
        />
      </SidebarContent>
    </Sidebar>
  );
};
