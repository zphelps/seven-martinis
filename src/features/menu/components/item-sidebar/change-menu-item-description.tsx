import { MenuItem } from "@/types/order"
import { UpdateMenuItemProps } from "@/features/menu/hooks/use-menu"
import { Textarea } from "@/components/ui/textarea"
import { useEffect } from "react"
import { useState } from "react"
import { useCallback } from "react"
import { debounce } from "lodash"

interface ChangeMenuItemDescriptionProps {
    menu_item: MenuItem
    updateMenuItem: (id: string, menu_item: UpdateMenuItemProps) => Promise<void>
}

export const ChangeMenuItemDescription = ({ menu_item, updateMenuItem }: ChangeMenuItemDescriptionProps) => {
    const [description, setDescription] = useState(menu_item.description)

    const debouncedUpdateMenuItem = useCallback(
        debounce(async (id: string, updatedDescription: string) => {
            await updateMenuItem(id, { description: updatedDescription });
        }, 500),
        []
    );

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newDescription = e.target.value;
        setDescription(newDescription);
        debouncedUpdateMenuItem(menu_item.id, newDescription);
    };

    useEffect(() => {
        setDescription(menu_item.description);
    }, [menu_item]);

    return (
        <div className="px-3">
            <p className="text-sm font-bold">Description</p>
            <p className="text-xs text-gray-500 mb-2">
                Enter a description for the menu item.
            </p>
            <Textarea
                className="h-24 bg-gray-50 hover:bg-gray-100 border-0 focus:border focus:border-gray-300 ring-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none"
                placeholder="Ex: A refreshing cocktail made with vodka, lemonade, and lime."
                value={description || ""}
                onChange={handleDescriptionChange}
            />
        </div>
    )
}