import { menuItems } from '../constant/sidebar-menu';

describe('menuItems', () => {
  test('should have the correct structure', () => {
    expect(Array.isArray(menuItems)).toBe(true);
    expect(menuItems.length).toBe(14);
  });

  test('each menu item should have required properties', () => {
    menuItems.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('path');
      expect(item).toHaveProperty('icon');
      expect(typeof item.id).toBe('string');
      expect(typeof item.name).toBe('string');
      expect(typeof item.path).toBe('string');
      expect(typeof item.icon).toBe('string');
    });
  });

  test('dashboard item should have correct values', () => {
    const dashboardItem = menuItems.find((item) => item.id === 'dashboard');
    expect(dashboardItem).toBeDefined();
    expect(dashboardItem).toEqual({
      id: 'dashboard',
      name: 'DASHBOARD',
      path: '/dashboard',
      icon: 'LayoutDashboard',
    });
    if (dashboardItem) {
      expect(dashboardItem.isIntegrated).toBeUndefined();
    }
  });

  test('IAM item should be integrated', () => {
    const iamItem = menuItems.find((item) => item.id === 'iam');
    expect(iamItem).toBeDefined();
    if (iamItem) {
      expect(iamItem.isIntegrated).toBe(true);
    }
    if (iamItem) {
      expect(iamItem.name).toBe('IAM');
      expect(iamItem.path).toBe('/identity-management');
      expect(iamItem.icon).toBe('Users');
    }
  });

  test('all paths should start with a slash', () => {
    menuItems.forEach((item) => {
      expect(item.path.startsWith('/')).toBe(true);
    });
  });
});
