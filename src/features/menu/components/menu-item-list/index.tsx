import { MenuItem } from "@/types/order";
import { MenuItemCard } from "./menu-item-card";


interface MenuListProps {
    menuItems: MenuItem[];
    loading?: boolean;
    error?: string;
}

export const MenuList = ({ menuItems, loading, error }: MenuListProps) => {
    return (
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
            {menuItems.map((menuItem) => (
                <MenuItemCard key={menuItem.id} menuItem={menuItem} />
            ))}
        </div>
    )
}