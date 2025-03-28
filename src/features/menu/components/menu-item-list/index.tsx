import { MenuItem } from "@/types/order";
import { MenuItemCard } from "./menu-item-card";
import { ItemTagFilter } from "../item-tag-filter";
import { useState, useMemo } from "react";
import { Loader2, Search } from "lucide-react";

interface MenuListProps {
    menuItems: MenuItem[];
    loading?: boolean;
    error?: string;
}

export function MenuList({ menuItems, loading, error }: MenuListProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredMenuItems = useMemo(() => {
        let filtered = menuItems;

        // Apply tag filtering
        if (selectedTags.length > 0) {
            filtered = filtered.filter(item =>
                selectedTags.every(tag => item.tags?.includes(tag))
            );
        }

        // Apply search filtering
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description?.toLowerCase().includes(query) || item.drink_number?.toString().includes(query)
            );
        }

        return filtered;
    }, [menuItems, selectedTags, searchQuery]);

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
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search drinks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-normal font-normal pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
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