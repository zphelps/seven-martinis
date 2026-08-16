"use client";

import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/types/order";
import { useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Tag as TagIcon, X } from "lucide-react";
import useTags from "@/features/tags/hooks/use-tags";

interface ItemTagFilterProps {
    menuItems: MenuItem[];
    selectedTags: string[];
    onTagSelect: (tagId: string) => void;
}

export const ItemTagFilter = ({ menuItems, selectedTags, onTagSelect }: ItemTagFilterProps) => {
    const { tags } = useTags();

    const tagCounts = useMemo(() => {
        const counts: { [key: string]: number } = {};
        menuItems.forEach(item => {
            item.tags?.forEach(tag => {
                counts[tag.id] = (counts[tag.id] || 0) + 1;
            });
        });
        return counts;
    }, [menuItems]);

    return (
        <div className="flex overflow-x-auto gap-1 pb-0 -mx-3 px-3 scrollbar-hide">
            {tags.map((tag) => {
                const count = tagCounts[tag.id] || 0;
                const isSelected = selectedTags.includes(tag.id);

                return (
                    <Badge
                        key={tag.id}
                        variant="outline"
                        className={cn(
                            "cursor-pointer py-3 rounded-lg px-3 bg-white border-border hover:border-primary/30 transition-colors flex-shrink-0",
                            isSelected && "bg-primary/10 text-primary border-primary hover:bg-primary/15 hover:border-primary"
                        )}
                        onClick={() => onTagSelect(tag.id)}
                    >
                        {tag.image_url ? (
                            <Image
                                src={tag.image_url}
                                className={cn(
                                    "mr-2.5 h-5 w-auto opacity-80"
                                )}
                                alt={tag.name}
                                height={20}
                                width={20}
                                style={{ objectFit: 'contain' }}
                            />
                        ) : (
                            <TagIcon className="mr-2.5 h-5 w-5 opacity-80" />
                        )}
                        <span className="whitespace-nowrap text-sm font-medium">{tag.name}</span>
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
