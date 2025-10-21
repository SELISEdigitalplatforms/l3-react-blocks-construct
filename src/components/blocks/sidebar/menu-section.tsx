import { SidebarMenu } from '@/components/ui/sidebar';
import { SidebarMenuItemComponent } from '../layout/sidebar-menu-Item';
import { MenuItem } from '@/models/sidebar';

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  showText: boolean;
  pathname: string;
  isMobile: boolean;
  open: boolean;
  onItemClick?: () => void;
}

export const MenuSection = ({
  title,
  items,
  showText,
  pathname,
  isMobile,
  open,
  onItemClick,
}: Readonly<MenuSectionProps>) => {
  return (
    <>
      {showText && (
        <div className="my-1 w-full ml-2">
          <p className="text-[10px] font-medium uppercase text-medium-emphasis">{title}</p>
        </div>
      )}

      {!open && !isMobile && (
        <div className="my-3 w-full">
          <hr className="border-t border-sidebar-border" />
        </div>
      )}

      {items.map((item) => (
        <SidebarMenu key={item.id} className="w-full font-medium">
          <SidebarMenuItemComponent
            item={item}
            showText={showText}
            isActive={pathname.includes(item.path)}
            onClick={onItemClick}
          />
        </SidebarMenu>
      ))}
    </>
  );
};
