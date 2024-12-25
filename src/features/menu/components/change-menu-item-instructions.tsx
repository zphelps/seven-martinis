import { Textarea } from "@/components/ui/textarea"
import { useEffect } from "react"
import { useState } from "react"
import { UpdateMenuItemProps } from "../hooks/use-menu"
import { MenuItem } from "@/types/order"
import { useCallback } from "react";
import { debounce } from "lodash";

interface ChangeMenuItemInstructionsProps {
    menu_item: MenuItem
    updateMenuItem: (id: string, menu_item: UpdateMenuItemProps) => Promise<void>
}

export const ChangeMenuItemInstructions = ({ menu_item, updateMenuItem }: ChangeMenuItemInstructionsProps) => {
    const [instructions, setInstructions] = useState(menu_item.instructions);

    const debouncedUpdateMenuItem = useCallback(
        debounce(async (id: string, updatedInstructions: string) => {
            await updateMenuItem(id, { instructions: updatedInstructions });
        }, 500),
        []
    );

    const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newInstructions = e.target.value;
        setInstructions(newInstructions);
        debouncedUpdateMenuItem(menu_item.id, newInstructions);
    };

    useEffect(() => {
        setInstructions(menu_item.instructions);
    }, [menu_item]);

    return (
        <div className="px-3">
            <p className="text-sm font-bold">
                Instructions
            </p>
            <p className="text-xs text-gray-500 mb-2">
                Enter instructions for the bartender to follow when making this drink.
            </p>
            <Textarea
                placeholder="Ex: Add vodka, lime, and soda water to a shaker, shake, and pour into a glass."
                value={instructions || ""}
                onChange={handleInstructionsChange}
                className="h-24 bg-gray-50 hover:bg-gray-100 border-0 focus:border focus:border-gray-300 ring-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none"
            />
        </div>
    );
};