"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InventoryItem } from "./columns";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import TypeChip from "./type-chip";

interface InventoryItemSidebarProps {
    inventory: InventoryItem[],
    updateInventoryItem: (id: string, item: InventoryItem) => void
}

export default function InventoryItemSidebar({ inventory, updateInventoryItem }: InventoryItemSidebarProps) {
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
            <SidebarContent className="bg-white">
                <SidebarGroup className="px-0">
                    <SidebarGroupContent className="bg-white">
                        {item && (
                            <div className="space-y-4">
                                {/* Image */}
                                <div className="w-full h-40 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="w-full rounded-md h-full object-cover" />
                                    ) : (
                                        <p className="text-xs text-center text-gray-500">No Image</p>
                                    )}
                                </div>

                                {/* Type */}
                                <div>
                                    <TypeChip type={item.type} />
                                </div>

                            </div>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}