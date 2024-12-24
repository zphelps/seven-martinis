"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InventoryItem } from "./columns";
import { TrashIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import TypeChip from "./type-chip";
import { ChangeStockSelect } from "./change-stock-select";
import { UpdateInventoryItemProps } from "../hooks/use-inventory";
import { ChangeTypeSelect } from "./change-type-select";
import { DeleteItemButton } from "./delete-item-button";

interface InventoryItemSidebarProps {
    inventory: InventoryItem[],
    updateInventoryItem: (id: string, item: UpdateInventoryItemProps) => Promise<void>,
    deleteInventoryItem: (id: string) => Promise<void>
}

export default function InventoryItemSidebar({ inventory, updateInventoryItem, deleteInventoryItem }: InventoryItemSidebarProps) {
    const { toggleSidebar, open } = useSidebar()
    const router = useRouter()

    const searchParams = useSearchParams()
    const id = searchParams.get("id")

    const [item, setItem] = useState<InventoryItem | null>(null)

    useEffect(() => {
        if (id && !open) {
            toggleSidebar()
        } else if (!id && open) {
            toggleSidebar()
        }
    }, [id, open])

    useEffect(() => {
        if (id) {
            console.log(inventory)
            setItem(inventory.find((item) => item.id === id) || null)
        }
    }, [id, inventory])

    return (
        <Sidebar side="right" variant="floating" className="pl-0 bg-white">
            <SidebarHeader className="gap-3.5 border-b h-[48px] bg-white rounded-t-lg flex justify-center">
                <div className="flex justify-between items-center gap-2">
                    <p className="text-md font-medium px-1">
                        {item ? item.name : "Inventory"}
                    </p>
                    <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/inventory")}>
                        <XIcon className="w-4 h-4" />
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-white h-full rounded-b-lg">
                <SidebarGroup className="px-0 h-full">
                    <SidebarGroupContent className="bg-white h-full">
                        {item && (
                            <div className="relative space-y-4 -mt-2 h-full flex flex-col">
                                {/* Image */}
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="flex w-full h-full object-cover" />
                                    ) : (
                                        <p className="text-xs text-center text-gray-500">No Image</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 px-2">
                                    <div className="w-full">
                                        <ChangeTypeSelect id={item.id} type={item.type} updateInventoryItem={updateInventoryItem} />
                                    </div>
                                    <div className="w-full">
                                        <ChangeStockSelect id={item.id} stock={item.stock} updateInventoryItem={updateInventoryItem} />
                                    </div>
                                </div>

                                <div className="absolute -bottom-1.5 left-0 right-0 px-2 mb-2">
                                    <DeleteItemButton id={item.id} deleteInventoryItem={deleteInventoryItem} />
                                </div>

                            </div>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}