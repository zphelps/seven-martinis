"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangeStockSelect } from "@/features/inventory/components/change-stock-select";
import useInventory, { UpdateInventoryItemProps } from "@/features/inventory/hooks/use-inventory";
import { ChangeTypeSelect } from "@/features/inventory/components/change-type-select";
import { DeleteItemButton } from "@/features/inventory/components/delete-item-button";
import { MenuItem } from "@/types/order";
import { UpdateMenuItemProps } from "../hooks/use-menu";
import { useRecipe } from "../../recipe/hooks/use-recipe";
import RecipeSection from "@/features/recipe/components/recipe-card";
import { ChangeMenuItemInstructions } from "./change-menu-item-instructions";
import { Separator } from "@/components/ui/separator";
import { ChangeMenuItemDescription } from "./change-menu-item-description";

interface MenuItemSidebarProps {
    menu: MenuItem[],
    updateMenuItem: (id: string, item: UpdateMenuItemProps) => Promise<void>,
    deleteMenuItem: (id: string) => Promise<void>
}

export default function MenuItemSidebar({ menu, updateMenuItem, deleteMenuItem }: MenuItemSidebarProps) {
    const { toggleSidebar, open } = useSidebar()
    const router = useRouter()

    const searchParams = useSearchParams()
    const id = searchParams.get("id")

    const [item, setItem] = useState<MenuItem | null>(null)
    const { recipe, loading, error, updateIngredient, addIngredient, deleteIngredient } = useRecipe({ menu_item_id: id })
    const { inventory, loading: inventoryLoading, error: inventoryError } = useInventory()

    useEffect(() => {
        if (id && !open) {
            toggleSidebar()
        } else if (!id && open) {
            toggleSidebar()
        }
    }, [id, open])

    useEffect(() => {
        if (id) {
            setItem(menu.find((item) => item.id === id) || null)
        }
    }, [id, menu])

    return (
        <Sidebar side="right" variant="floating" className="pl-0 bg-white">
            <SidebarHeader className="gap-3.5 border-b h-[48px] bg-white rounded-t-lg flex justify-center">
                <div className="flex justify-between items-center gap-2">
                    <p className="text-md font-medium px-1">
                        {item ? item.name : "Inventory"}
                    </p>
                    <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/menu")}>
                        <XIcon className="w-4 h-4" />
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-white h-full rounded-b-lg">
                <SidebarGroup className="px-0 h-full">
                    <SidebarGroupContent className="bg-white h-full">
                        {item && (
                            <div className="relative space-y-4 h-full flex flex-col">
                                <ChangeMenuItemDescription
                                    menu_item={item}
                                    updateMenuItem={updateMenuItem}
                                />
                                <Separator />
                                {recipe && inventory && recipe.menu_item_id === item.id && <RecipeSection
                                    recipe={recipe}
                                    inventory={inventory}
                                    updateIngredient={updateIngredient}
                                    addIngredient={addIngredient}
                                    deleteIngredient={deleteIngredient}
                                />}
                                <Separator />
                                <ChangeMenuItemInstructions
                                    menu_item={item}
                                    updateMenuItem={updateMenuItem}
                                />
                            </div>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}