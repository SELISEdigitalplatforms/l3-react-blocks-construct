/**
 * A mapping of application routes to their corresponding i18n translation module names.
 * Each route is mapped to an array of module names that should be loaded for that route.
 *
 * @type {Record<string, string[]>}
 * @property {string[]} [key] - The application route path
 * @property {string[]} [value] - Array of module names to load for the route
 *                                Always includes 'common' as the base module
 *                                followed by route-specific module names
 */
export const routeModuleMap: Record<string, string[]> = {
  '/dashboard': ['common', 'dashboard'],
  '/finance': ['common', 'finance'],
  '/identity-management': ['common', 'iam'],
  '/inventory': ['common', 'inventory'],
  '/mail': ['common', 'mail'],
  '/calendar': ['common', 'calendar'],
  '/activity-log': ['common', 'timeline'],
  '/timeline': ['common', 'timeline'],
  '/task-manager': ['common', 'task-manager'],
  '/chat': ['common', 'chat'],
  '/invoices': ['common', 'invoices'],
  '/file-manager': ['common', 'file-manager'],
  '/profile': ['common', 'profile', 'mfa'],
  '/404': ['common', 'error'],
  '/503': ['common', 'error'],
};
