import { MenuItem } from "@/types/order";
import { ItemDialog } from "../item-dialog";
interface MenuItemCardProps {
    menuItem: MenuItem;
}

export const MenuItemCard = ({ menuItem }: MenuItemCardProps) => {
    return (
        <ItemDialog menuItem={menuItem}>
            <div className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer hover:bg-gray-50">
                <div className="flex flex-row justify-start items-center gap-2">
                    <div className="flex flex-col gap-1">
                        <p className="text-normal font-normal">
                            #{menuItem.drink_number}. {menuItem.name}
                        </p>
                        <p className="text-sm text-gray-500">
                            {menuItem.description}
                        </p>
                    </div>
                </div>
            </div>
        </ItemDialog>
    )
}