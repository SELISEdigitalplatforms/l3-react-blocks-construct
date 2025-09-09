import { useState, useEffect } from 'react';
import { MenuItem } from '../models/sidebar';
import { menuItems } from '../constant/sidebar-menu';

/**
 * Get all available menu item IDs for validation
 */
const getAllAvailableMenuIds = (): string[] => {
  return menuItems.map(item => item.id);
};

/**
 * Dynamic menu hook that loads menu items from blocks_constructs_selected file.
 * Falls back to all menu items if file is missing or contains invalid entries.
 */
export function useDynamicMenu() {
  const [dynamicMenuItems, setDynamicMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load menu configuration from public/blocks_constructs_selected
        const response = await fetch('/blocks_constructs_selected');
        
        if (!response.ok) {
          if (response.status === 404) {
            // File missing - show all menu items
            setDynamicMenuItems(menuItems);
            return;
          }
          throw new Error(`Failed to load menu configuration: ${response.statusText}`);
        }

        const configText = await response.text();
        
        // Parse newline-separated menu item IDs and filter invalid ones
        const allMenuIds = getAllAvailableMenuIds();
        const selectedMenuIds = configText
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0)
          .filter((id: string) => allMenuIds.includes(id));

        // No valid items found - show all menu items
        if (selectedMenuIds.length === 0) {
          setDynamicMenuItems(menuItems);
          return;
        }

        // Filter menu items to only show selected ones, but always include error pages
        const filteredItems = menuItems.filter(item => 
          selectedMenuIds.includes(item.id) || item.id === '404' || item.id === '503'
        );

        setDynamicMenuItems(filteredItems);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu configuration');
        // Fallback to all menu items if configuration fails
        setDynamicMenuItems(menuItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  return {
    menuItems: dynamicMenuItems,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      // Trigger reload by updating a dependency
      setDynamicMenuItems([]);
    }
  };
}
