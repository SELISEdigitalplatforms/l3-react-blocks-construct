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
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  User,
  ChevronRight,
  FileUser,
  Users,
  Server,
  Store,
  CircleHelp,
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = iconMap[name];
  return <LucideIcon {...props} />;
};
