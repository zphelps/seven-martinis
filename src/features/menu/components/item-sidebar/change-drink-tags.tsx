import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types/order";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import useTags from "@/features/tags/hooks/use-tags";

interface ChangeDrinkTagsProps {
    item: MenuItem | null;
    updateMenuItemTags: (id: string, tagIds: string[]) => Promise<void>;
}

export function ChangeDrinkTags({ item, updateMenuItemTags }: ChangeDrinkTagsProps) {
    const [isAddingTag, setIsAddingTag] = useState(false);
    const { tags: availableTags } = useTags();

    const handleAddTag = async (tagId: string) => {
        if (!item || item.tags?.some((tag) => tag.id === tagId)) return;

        try {
            const updatedTagIds = [...(item.tags || []).map((tag) => tag.id), tagId];
            await updateMenuItemTags(item.id, updatedTagIds);
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

    const handleRemoveTag = async (tagIdToRemove: string) => {
        if (!item) return;

        try {
            const updatedTagIds = (item.tags || [])
                .filter((tag) => tag.id !== tagIdToRemove)
                .map((tag) => tag.id);
            await updateMenuItemTags(item.id, updatedTagIds);
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
                        key={tag.id}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => handleRemoveTag(tag.id)}
                    >
                        {tag.name}
                        <X className="w-3 h-3 ml-1" />
                    </Badge>
                ))}
            </div>
            {isAddingTag && (
                <div className="flex flex-wrap gap-2 mt-2 border-t pt-2 border-gray-200">
                    {availableTags
                        .filter((tag) => !item.tags?.some((itemTag) => itemTag.id === tag.id))
                        .map((tag) => (
                            <Badge
                                key={tag.id}
                                variant="outline"
                                className="cursor-pointer hover:bg-blue-100"
                                onClick={() => handleAddTag(tag.id)}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                </div>
            )}
        </div>
    );
}
