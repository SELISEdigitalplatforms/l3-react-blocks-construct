import { MenuItem } from '../models/sidebar';

/**
 * Maps menu item IDs to route paths and component names.
 * Used by DynamicRoutes to conditionally register routes.
 */
export const routeConfig: Record<string, { path: string; component: string }> = {
  'dashboard': { path: '/dashboard', component: 'Dashboard' },
  'finance': { path: '/finance', component: 'Finance' },
  'iam': { path: '/identity-management', component: 'TaskPage' },
  'inventory': { path: '/inventory', component: 'Inventory' },
  'mail': { path: '/mail', component: 'Email' },
  'calendar': { path: '/calendar', component: 'CalendarPage' },
  'activity-log': { path: '/activity-log', component: 'ActivityLogPage1' },
  'timeline': { path: '/timeline', component: 'ActivityLogPage2' },
  'task-manager': { path: '/task-manager', component: 'TaskManager' },
  'chat': { path: '/chat', component: 'ChatPage' },
  'invoices': { path: '/invoices', component: 'InvoicesPage' },
  'file-manager': { path: '/file-manager', component: 'FileManagerMyFiles' },
  // Note: 404 and 503 are handled separately as they should always be available
};

/** Get route config for a menu item */
export function getRouteConfig(menuItem: MenuItem) {
  return routeConfig[menuItem.id];
}

/** Check if menu item has route configuration */
export function hasRouteConfig(menuItem: MenuItem): boolean {
  return menuItem.id in routeConfig;
}

/** Get all route paths for menu items */
export function getRoutePaths(menuItems: MenuItem[]): string[] {
  return menuItems
    .filter(hasRouteConfig)
    .map(item => getRouteConfig(item)?.path)
    .filter(Boolean) as string[];
}
