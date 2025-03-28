import { MenuItem } from "@/types/order";
import { MenuItemCard } from "./menu-item-card";
import { ItemTagFilter } from "../item-tag-filter";
import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";

interface MenuListProps {
    menuItems: MenuItem[];
    loading?: boolean;
    error?: string;
}

export function MenuList({ menuItems, loading, error }: MenuListProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const filteredMenuItems = useMemo(() => {
        if (selectedTags.length === 0) return menuItems;

        return menuItems.filter(item =>
            selectedTags.every(tag => item.tags?.includes(tag))
        );
    }, [menuItems, selectedTags]);

    const handleTagSelect = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    );
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="py-4 px-2 space-y-4">
            <ItemTagFilter
                menuItems={menuItems}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
            />
            {filteredMenuItems.length === 0 ? (
                <div className="text-center py-8 px-2 text-gray-500">
                    No drinks match the selected filters. Try adjusting your filter selections.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {filteredMenuItems.map((item) => (
                        <MenuItemCard key={item.id} menuItem={item} />
                    ))}
                </div>
            )}
        </div>
    );
}