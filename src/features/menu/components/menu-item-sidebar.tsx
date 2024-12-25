"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types/order";
import { UpdateMenuItemProps } from "../hooks/use-menu";
import { useRecipe } from "../../recipe/hooks/use-recipe";
import { ChangeMenuItemInstructions } from "./change-menu-item-instructions";
import { Separator } from "@/components/ui/separator";
import { ChangeMenuItemDescription } from "./change-menu-item-description";
import ChangeRecipeSection from "@/features/recipe/components/change-recipe-section";
import useInventory from "@/features/inventory/hooks/use-inventory";
import { ChangeDrinkNumber } from "./change-drink-number";
import { ChangeDrinkName } from "./change-drink-name";

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
                <div className="flex justify-between items-center">
                    <ChangeDrinkNumber
                        item={item}
                        updateMenuItem={updateMenuItem}
                    />
                    <ChangeDrinkName
                        item={item}
                        updateMenuItem={updateMenuItem}
                    />
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
                                <ChangeRecipeSection
                                    recipe={id === recipe?.menu_item_id ? recipe : null}
                                    inventory={inventory}
                                    updateIngredient={updateIngredient}
                                    addIngredient={addIngredient}
                                    deleteIngredient={deleteIngredient}
                                />
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