"use client";

import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/types/order";
import { useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const AVAILABLE_TAGS = ["New", "Vodka", "Gin", "Bourbon", "Tequila", "Rum", "Whiskey", "Wine", "Special", "Copycats"];

interface ItemTagFilterProps {
    menuItems: MenuItem[];
    selectedTags: string[];
    onTagSelect: (tag: string) => void;
}

export const ItemTagFilter = ({ menuItems, selectedTags, onTagSelect }: ItemTagFilterProps) => {

    const tagCounts = useMemo(() => {
        const counts: { [key: string]: number } = {};
        menuItems.forEach(item => {
            item.tags?.forEach(tag => {
                counts[tag] = (counts[tag] || 0) + 1;
            });
        });
        return counts;
    }, [menuItems]);

    return (
        <div className="flex overflow-x-auto gap-1 pb-0 -mx-3 px-3 scrollbar-hide">
            {AVAILABLE_TAGS.map((tag) => {
                const count = tagCounts[tag] || 0;
                const isSelected = selectedTags.includes(tag);

                return (
                    <Badge
                        key={tag}
                        variant="outline"
                        className={cn(
                            "cursor-pointer py-3 rounded-lg px-3 bg-white border-border hover:border-primary/30 transition-colors flex-shrink-0",
                            isSelected && "bg-primary/10 text-primary border-primary hover:bg-primary/15 hover:border-primary"
                        )}
                        onClick={() => onTagSelect(tag)}
                    >
                        <Image
                            src={`/${tag.toLowerCase()}.png`}
                            className={cn(
                                "mr-2.5 h-5 w-auto opacity-80"
                            )}
                            alt={tag}
                            height={20}
                            width={20}
                            style={{ objectFit: 'contain' }}
                        />
                        <span className="whitespace-nowrap text-sm font-medium">{tag}</span>
                        {count > 0 && (
                            <span className={cn(
                                "ml-1.5 text-xs font-normal",
                                isSelected ? "text-primary/70" : "text-muted-foreground"
                            )}>
                                ({count})
                            </span>
                        )}
                        {isSelected && (
                            <X className="ml-1.5 h-3 w-3 text-primary/70" />
                        )}
                    </Badge>
                );
            })}
        </div>
    );
};
