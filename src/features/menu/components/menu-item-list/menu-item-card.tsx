"use client";

import { MenuItem } from "@/types/order";
import { ItemDialog } from "../item-dialog";

interface MenuItemCardProps {
    menuItem: MenuItem;
}

export const MenuItemCard = ({ menuItem }: MenuItemCardProps) => {
    return (
        <ItemDialog menuItem={menuItem}>
            <div className="group cursor-pointer bg-white border border-border md:hover:border-primary/30 rounded-xl p-3 transition-all duration-200 h-full md:hover-lift">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center md:group-hover:bg-accent/10 md:group-hover:border-accent/30 transition-colors">
                        <span className="text-xs font-mono font-semibold text-primary md:group-hover:text-accent transition-colors">
                            {menuItem.drink_number}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-md font-bold text-foreground md:group-hover:text-primary transition-colors truncate">
                            {menuItem.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0 line-clamp-2 leading-relaxed">
                            {menuItem.description}
                        </p>
                    </div>
                </div>
            </div>
        </ItemDialog>
    )
}
