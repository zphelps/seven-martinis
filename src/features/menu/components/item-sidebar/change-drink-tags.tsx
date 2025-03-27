import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types/order";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { UpdateMenuItemProps } from "@/features/menu/hooks/use-menu";

const AVAILABLE_TAGS = ["Vodka", "Gin", "Bourbon", "Tequila", "Rum", "Whiskey", "Beer", "Wine", "Cocktail", "Mocktail"];

interface ChangeDrinkTagsProps {
    item: MenuItem | null;
    updateMenuItem: (id: string, item: UpdateMenuItemProps) => Promise<void>;
}

export function ChangeDrinkTags({ item, updateMenuItem }: ChangeDrinkTagsProps) {
    const [isAddingTag, setIsAddingTag] = useState(false);

    const handleAddTag = async (tag: string) => {
        if (!item || !tag || item.tags?.includes(tag)) return;

        try {
            const updatedTags = [...(item.tags || []), tag];
            await updateMenuItem(item.id, { tags: updatedTags });
            toast({
                title: "Tag added successfully",
            });
        } catch (error) {
            toast({
                title: "Failed to add tag",
                variant: "destructive",
            });
        } finally {
            setIsAddingTag(false);
        }
    };

    const handleRemoveTag = async (tagToRemove: string) => {
        if (!item) return;

        try {
            const updatedTags = (item.tags || []).filter(tag => tag !== tagToRemove);
            await updateMenuItem(item.id, { tags: updatedTags });
            toast({
                title: "Tag removed successfully",
            });
        } catch (error) {
            toast({
                title: "Failed to remove tag",
                variant: "destructive",
            });
        }
    };

    if (!item) return null;

    return (
        <div className="space-y-2">
            <div className="flex items-start justify-between">
                <div className="">
                    <p className="text-sm font-semibold text-black">
                        Tags
                    </p>
                    <p className="text-xs font-normal text-gray-500">
                        Add tags to this drink
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingTag(!isAddingTag)}
                    className="h-7 px-2 text-xs text-black"
                >
                    <Plus className="h-3 w-3 mr-0" />
                    Add Tag
                </Button>
            </div>
            <div className="flex flex-wrap gap-2">
                {item.tags?.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => handleRemoveTag(tag)}
                    >
                        {tag}
                        <X className="w-3 h-3 ml-1" />
                    </Badge>
                ))}
            </div>
            {isAddingTag && (
                <div className="flex flex-wrap gap-2 mt-2 border-t pt-2 border-gray-200">
                    {AVAILABLE_TAGS.filter(tag => !item.tags?.includes(tag)).map((tag) => (
                        <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-blue-100"
                            onClick={() => handleAddTag(tag)}
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
} 