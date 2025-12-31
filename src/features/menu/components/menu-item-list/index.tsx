"use client";

import { MenuItem } from "@/types/order";
import { MenuItemCard } from "./menu-item-card";
import { ItemTagFilter } from "../item-tag-filter";
import { ItemDialog } from "../item-dialog";
import { useState, useMemo } from "react";
import { Search, Martini, Snowflake } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface MenuListProps {
    menuItems: MenuItem[];
    loading?: boolean;
    error?: string;
}

export function MenuList({ menuItems, loading, error }: MenuListProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Winter drinks for the featured section
    const winterDrinks = useMemo(() => {
        return menuItems.filter(item => item.tags?.includes("Winter"));
    }, [menuItems]);

    // Regular menu items (excluding winter drinks when showing featured section)
    const regularMenuItems = useMemo(() => {
        return menuItems.filter(item => !item.tags?.includes("Winter"));
    }, [menuItems]);

    // Check if we should show the featured winter section (only when no filters/search)
    const showWinterSection = selectedTags.length === 0 && !searchQuery.trim() && winterDrinks.length > 0;

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
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center animate-pulse border border-primary/10">
                <Martini className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Loading menu...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-4">
            <p className="text-destructive">Error loading menu</p>
            <p className="text-sm text-muted-foreground">{error}</p>
        </div>
    );

    return (
        <div className="py-3 px-3 space-y-3 md:pb-6 pb-20">
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
            ) : showWinterSection ? (
                <div className="space-y-6">
                    {/* Winter Featured Section */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
                        {/* Decorative snowflakes */}
                        <div className="absolute top-4 right-6 opacity-15">
                            <Snowflake className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute bottom-20 left-4 opacity-10">
                            <Snowflake className="w-14 h-14 text-white" />
                        </div>
                        <div className="absolute top-1/3 right-1/3 opacity-8">
                            <Snowflake className="w-6 h-6 text-white" />
                        </div>

                        {/* Header */}
                        <div className="relative z-10 p-5 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                    <Image
                                        src="/winter.png"
                                        alt="Winter"
                                        width={24}
                                        height={24}
                                        className="opacity-90"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-serif font-semibold text-white">
                                        Seven For Winter
                                    </h2>
                                    <p className="text-sm text-blue-200/70">
                                        Seasonal favorites to warm your spirit
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Winter drinks list */}
                        <div className="relative z-10 px-4 pb-4 space-y-2">
                            {winterDrinks.map((item) => (
                                <ItemDialog key={item.id} menuItem={item}>
                                    <div className="cursor-pointer group">
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3.5 transition-all duration-200 hover:bg-white/15 hover:border-white/30">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-400/20 border border-blue-300/30 flex items-center justify-center">
                                                    <span className="text-xs font-mono font-bold text-blue-200">
                                                        {item.drink_number}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-serif text-base font-semibold text-white leading-tight truncate">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-blue-100/60 mt-0.5 line-clamp-2 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ItemDialog>
                            ))}
                        </div>
                    </div>

                    {/* Regular Menu Section */}
                    {regularMenuItems.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <h2 className="text-lg font-semibold text-foreground">Full Menu</h2>
                                <span className="text-sm text-muted-foreground">
                                    ({regularMenuItems.length} drinks)
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {regularMenuItems.map((item) => (
                                    <MenuItemCard key={item.id} menuItem={item} />
                                ))}
                            </div>
                        </div>
                    )}
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
