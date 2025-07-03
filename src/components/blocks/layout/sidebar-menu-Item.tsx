import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from 'components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
import { Icon, IconName } from '../menu-icon/menu-icon';
import { SidebarMenuItemProps } from 'models/sidebar';
import { useTranslation } from 'react-i18next';

export const SidebarMenuItemComponent: React.FC<SidebarMenuItemProps> = ({
  item,
  showText,
  onClick,
}) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const [isOpen, setIsOpen] = useState(false);

  const isParentActive =
    hasChildren && item.children?.some((child) => pathname.startsWith(child.path));
  const isActive = pathname.startsWith(item.path) || isParentActive;

  useEffect(() => {
    if (isParentActive && !isOpen) {
      setIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isParentActive]);

  const strokeWidth = 2.2;

  const renderIcon = (iconName: IconName | undefined) => {
    if (!iconName) return null;

    return (
      <div className="flex items-center justify-center w-6 h-6">
        <Icon
          name={iconName}
          size={20}
          strokeWidth={strokeWidth}
          className={`${isActive ? 'text-primary' : 'text-high-emphasis'}`}
        />
      </div>
    );
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  if (hasChildren) {
    return (
      <Collapsible className="group/collapsible" open={isOpen} onOpenChange={setIsOpen}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton onClick={handleClick}>
              <div className="flex items-center justify-start w-full">
                {renderIcon(item.icon as IconName)}
                <span
                  className={`ml-3 truncate ${!showText && 'hidden'} ${isActive ? 'text-primary' : 'text-high-emphasis'} text-base`}
                >
                  {t(item.name)}
                </span>
                {showText && (
                  <ChevronRight
                    strokeWidth={strokeWidth}
                    className={`${isActive ? 'text-primary' : 'text-high-emphasis'} ml-auto h-5 w-5 transition-transform group-data-[state=open]/collapsible:rotate-90`}
                  />
                )}
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children?.map((child) => {
                const isChildActive = pathname.startsWith(child.path);
                return (
                  <SidebarMenuSubItem key={child.id}>
                    <SidebarMenuSubButton asChild className={isChildActive ? 'bg-surface' : ''}>
                      <Link
                        to={child.path}
                        className="flex items-center w-full"
                        onClick={handleClick}
                      >
                        {renderIcon(child.icon as IconName)}
                        <span
                          className={`ml-3 truncate ${!showText && 'hidden'} ${isChildActive ? 'text-primary' : 'text-high-emphasis'} text-base`}
                        >
                          {t(child.name)}
                        </span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className={isActive ? 'bg-surface' : ''}>
        <Link to={item.path} className="flex items-center w-full" onClick={handleClick}>
          {renderIcon(item.icon as IconName)}
          <span
            className={`ml-3 truncate ${!showText && 'hidden'} ${isActive ? 'text-primary' : 'text-high-emphasis'} text-base`}
          >
            {t(item.name)}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
