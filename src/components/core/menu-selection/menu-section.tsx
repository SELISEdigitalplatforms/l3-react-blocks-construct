import { SidebarMenu } from '@/components/ui-kit/sidebar';
import { MenuItem } from '@/models/sidebar';
import { SidebarMenuItemComponent } from '../sidebar-menu-item/sidebar-menu-Item';

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  showText: boolean;
  pathname: string;
  onItemClick?: () => void;
}

export const MenuSection = ({
  title,
  items,
  showText,
  pathname,
  onItemClick,
}: Readonly<MenuSectionProps>) => {
  return (
    <>
      {showText && (
        <div className="my-1 w-full ml-2">
          <p className="text-[10px] font-medium uppercase text-medium-emphasis">{title}</p>
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
