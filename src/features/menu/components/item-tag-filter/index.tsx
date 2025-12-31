"use client";

import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/types/order";
import { useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const AVAILABLE_TAGS = ["Winter", "New", "Vodka", "Gin", "Bourbon", "Tequila", "Rum", "Whiskey", "Wine", "Special", "Copycats"];

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
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-2 px-2 scrollbar-hide">
            {AVAILABLE_TAGS.map((tag) => {
                const count = tagCounts[tag] || 0;
                const isSelected = selectedTags.includes(tag);

                return (
                    <Badge
                        key={tag}
                        variant="outline"
                        className={cn(
                            "cursor-pointer py-2 px-3 bg-white border-border hover:border-primary/30 transition-colors flex-shrink-0",
                            isSelected && "bg-primary text-white border-primary hover:bg-primary/90"
                        )}
                        onClick={() => onTagSelect(tag)}
                    >
                        <Image
                            src={`/${tag.toLowerCase()}.png`}
                            className={cn(
                                "mr-2 h-4 w-auto",
                                isSelected ? "brightness-0 invert" : "opacity-80"
                            )}
                            alt={tag}
                            height={16}
                            width={16}
                            style={{ objectFit: 'contain' }}
                        />
                        <span className="whitespace-nowrap">{tag}</span>
                        {count > 0 && (
                            <span className={cn(
                                "ml-1.5 text-xs",
                                isSelected ? "text-white/70" : "text-muted-foreground"
                            )}>
                                {count}
                            </span>
                        )}
                        {isSelected && (
                            <X className="ml-1.5 h-3 w-3 text-white/80" />
                        )}
                    </Badge>
                );
            })}
        </div>
    );
};
