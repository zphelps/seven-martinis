"use client";

import { MenuItem } from "@/types/order";
import { ItemDialog } from "../item-dialog";
import { Martini } from "lucide-react";

interface MenuItemCardProps {
    menuItem: MenuItem;
}

export const MenuItemCard = ({ menuItem }: MenuItemCardProps) => {
    return (
        <ItemDialog menuItem={menuItem}>
            <div className="group cursor-pointer bg-white hover:bg-white border border-border hover:border-primary/30 rounded-xl p-4 transition-all duration-200 h-full hover-lift">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/30 transition-colors">
                        <Martini className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                            <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                {menuItem.name}
                            </h3>
                            <span className="text-sm font-mono text-muted-foreground flex-shrink-0">
                                #{menuItem.drink_number}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {menuItem.description}
                        </p>
                    </div>
                </div>
            </div>
        </ItemDialog>
    )
}
