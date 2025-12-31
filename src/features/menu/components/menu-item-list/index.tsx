"use client";

import { MenuItem } from "@/types/order";
import { MenuItemCard } from "./menu-item-card";
import { ItemTagFilter } from "../item-tag-filter";
import { useState, useMemo } from "react";
import { Search, Martini } from "lucide-react";
import { Input } from "@/components/ui/input";

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

        if (selectedTags.length > 0) {
            filtered = filtered.filter(item =>
                selectedTags.every(tag => item.tags?.includes(tag))
            );
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description?.toLowerCase().includes(query) ||
                item.drink_number?.toString().includes(query)
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
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center animate-pulse border border-primary/10">
                <Martini className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Loading menu...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
            <p className="text-destructive">Error loading menu</p>
            <p className="text-sm text-muted-foreground">{error}</p>
        </div>
    );

    return (
        <div className="py-3 px-3 space-y-3 pb-20 md:pb-6">
            {/* Search and filters section */}
            <div className="space-y-2">
                {/* Search input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Find a drink..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white border-border focus:border-primary h-11"
                    />
                </div>

                {/* Tag filters */}
                <ItemTagFilter
                    menuItems={menuItems}
                    selectedTags={selectedTags}
                    onTagSelect={handleTagSelect}
                />
            </div>

            {/* Results */}
            {filteredMenuItems.length === 0 ? (
                <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                        <Martini className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                        No drinks match your search
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedTags([]);
                        }}
                        className="text-accent hover:underline text-sm font-medium"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div>
                    <p className="text-sm text-muted-foreground mb-2">
                        {filteredMenuItems.length} {filteredMenuItems.length === 1 ? 'drink' : 'drinks'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {filteredMenuItems.map((item) => (
                            <MenuItemCard key={item.id} menuItem={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
