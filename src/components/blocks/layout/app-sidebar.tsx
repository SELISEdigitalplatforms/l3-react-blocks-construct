import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, useSidebar } from '../../ui/sidebar';
import { menuItems } from '../../../constant/sidebar-menu';
import { SidebarMenuItemComponent } from './sidebar-menu-Item';
import darklogo from 'assets/images/construct_logo_dark.svg';
import lightlogo from 'assets/images/construct_logo_light.svg';
import lightsmallLogo from 'assets/images/construct_logo_small_light.svg';
import darksmallLogo from 'assets/images/construct_logo_small_dark.svg';

import { X } from 'lucide-react';
import { useTheme } from 'components/core/theme-provider';

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
 * @returns {JSX.Element} A collapsible sidebar navigation component
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

export function AppSidebar() {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const { setOpenMobile, open, isMobile, openMobile } = useSidebar();

  const integratedMenuItems = menuItems.filter((item) => item.isIntegrated === true);
  const designOnlyMenuItems = menuItems.filter((item) => item.isIntegrated !== true);

  useEffect(() => {
    if (!isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, setOpenMobile, isMobile]);

  const sidebarStyle = isMobile
    ? ({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100%',
        zIndex: 50,
        borderRight: 'none',
        transition: 'transform 0.3s ease-in-out',
        transform: openMobile ? 'translateX(0)' : 'translateX(-100%)',
      } as React.CSSProperties)
    : ({
        width: open ? 'var(--sidebar-width)' : '64px',
        minWidth: open ? 'var(--sidebar-width)' : '64px',
        transition: 'width 0.3s ease, min-width 0.3s ease',
        height: '100%',
        borderRight: '1px solid var(--border-color, #e2e8f0)',
      } as React.CSSProperties);

  if (isMobile && !openMobile) {
    return null;
  }

  return (
    <Sidebar
      className={`bg-card h-full ${isMobile ? 'mobile-sidebar' : ''}`}
      collapsible={isMobile ? 'none' : 'icon'}
      style={sidebarStyle}
    >
      <SidebarHeader className="p-2">
        <div className="relative h-10 w-full">
          <img
            src={theme == 'dark' ? darklogo : lightlogo}
            alt="logo"
            className={`absolute left-4 top-1 h-10 w-auto max-w-full transition-all duration-300 ${
              open || isMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />

          <img
            src={theme == 'dark' ? darksmallLogo : lightsmallLogo}
            alt="smallLogo"
            className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300  ${
              open || isMobile ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />

          {isMobile && (
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              onClick={() => setOpenMobile(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="text-base ml-4 mr-2 my-3 text-high-emphasis font-normal">
        {(open || isMobile) && (
          <div className="my-1 w-full ml-2">
            <p className="text-[10px] font-medium uppercase text-medium-emphasis">
              Cloud Integrated
            </p>
          </div>
        )}

        {!open && !isMobile && (
          <div className="my-3 w-full">
            <hr className="border-t border-sidebar-border" />
          </div>
        )}

        {integratedMenuItems.map((item) => (
          <SidebarMenu key={item.id} className="w-full font-medium">
            <SidebarMenuItemComponent
              item={item}
              showText={open || isMobile}
              isActive={pathname.includes(item.path)}
              onClick={isMobile ? () => setOpenMobile(false) : undefined}
            />
          </SidebarMenu>
        ))}

        {(open || isMobile) && (
          <div className="my-1 w-full ml-2">
            <p className="text-[10px] font-medium uppercase text-medium-emphasis">Design only</p>
          </div>
        )}

        {!open && !isMobile && (
          <div className="my-3 w-full">
            <hr className="border-t border-sidebar-border" />
          </div>
        )}

        {designOnlyMenuItems.map((item) => (
          <SidebarMenu key={item.id} className="w-full font-medium">
            <SidebarMenuItemComponent
              item={item}
              showText={open || isMobile}
              isActive={pathname.includes(item.path)}
              onClick={isMobile ? () => setOpenMobile(false) : undefined}
            />
          </SidebarMenu>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
