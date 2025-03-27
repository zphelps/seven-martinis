import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/types/order";
import { useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
const AVAILABLE_TAGS = ["Vodka", "Gin", "Bourbon", "Tequila", "Rum", "Whiskey", "Beer", "Wine", "Cocktail", "Mocktail"];

interface ItemTagFilterProps {
    menuItems: MenuItem[];
    selectedTags: string[];
    onTagSelect: (tag: string) => void;
}

export const ItemTagFilter = ({ menuItems, selectedTags, onTagSelect }: ItemTagFilterProps) => {

    // Get tag counts for each tag
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
        <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => {
                const count = tagCounts[tag] || 0;
                const isSelected = selectedTags.includes(tag);

                return (
                    <Badge
                        key={tag}
                        variant={"outline"}
                        className={cn(
                            "cursor-pointer py-1.5 px-3 border-gray-200 bg-white",
                            isSelected && "bg-blue-100 hover:bg-blue-100 border-blue-100"
                        )}
                        onClick={() => onTagSelect(tag)}
                    >
                        <Image
                            src={`/${tag.toLowerCase()}.png`}
                            className="mr-2 h-5 w-auto"
                            alt={tag}
                            height={16}
                            width={16}
                            style={{ objectFit: 'contain' }}
                        />
                        {tag}
                        {count > 0 && (
                            <span className="ml-1 text-xs text-gray-500">
                                ({count})
                            </span>
                        )}
                        {isSelected && (
                            <X className="ml-1 h-4 w-4 p-0 m-0 -mr-1 text-gray-500 rounded-full" />
                        )}

                    </Badge>
                );
            })}
        </div>
    );
};