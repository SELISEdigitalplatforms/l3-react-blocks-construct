import React from 'react';
import {
  LayoutDashboard,
  User,
  ChevronRight,
  FileUser,
  Users,
  Server,
  Store,
  CircleHelp,
  Inbox,
  FileClock,
  Presentation,
  Calendar,
  History,
  SearchX,
  TriangleAlert,
  ChartNoAxesCombined,
  ReceiptText,
  Folder,
  MessageSquareText,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

/**
 * MenuIcon Component
 *
 * A reusable icon component that maps string names to Lucide icons.
 * This abstraction allows for consistent icon usage throughout the application
 * by referencing icons by name rather than importing individual components.
 *
 * Features:
 * - Provides type safety for icon names
 * - Maps string identifiers to Lucide icon components
 * - Passes through all standard Lucide props to the icon component
 * - Maintains a centralized registry of available icons
 *
 * Types:
 * @typedef {keyof typeof iconMap} IconName - Union type of all available icon names
 *
 * Props:
 * @param {IconName} name - The name of the icon to render from the iconMap
 * @param {...LucideProps} props - Additional props to pass to the Lucide icon component
 *
 * @example
 * // Basic usage
 * <MenuIcon name="User" />
 *
 * // With additional props
 * <MenuIcon name="LayoutDashboard" size={24} color="blue" className="mr-2" />
 *
 * // In a navigation item
 * <NavItem>
 *   <MenuIcon name="Store" className="mr-2" />
 *   <span>Products</span>
 * </NavItem>
 */

const iconMap = {
  LayoutDashboard,
  User,
  ChevronRight,
  FileUser,
  Users,
  Server,
  Store,
  CircleHelp,
  Inbox,
  FileClock,
  Presentation,
  Calendar,
  History,
  SearchX,
  TriangleAlert,
  ChartNoAxesCombined,
  ReceiptText,
  Folder,
  MessageSquareText,
} as const;

export type MenuIconName = keyof typeof iconMap;

interface MenuIconProps extends Omit<LucideProps, 'ref'> {
  name: MenuIconName;
}

export const MenuIcon = ({ name, ...props }: Readonly<MenuIconProps>) => {
  const LucideIcon = iconMap[name];
  return <LucideIcon {...props} />;
};
