"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { columns } from "@/features/inventory/components/columns"
import { InventoryDataTable } from "@/features/inventory/components/data-table"
import InventoryItemSidebar from "@/features/inventory/components/inventory-item-sidebar"
import useInventory from "@/features/inventory/hooks/use-inventory"
import { Loader2 } from "lucide-react"

export default function InventoryPage() {
    const { inventory,
        updateInventoryItem,
        loading,
        error,
        addInventoryItem,
        deleteInventoryItem } = useInventory()

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin" />
            </div>
        )
    }
    if (error) return <div>Error: {error}</div>

    return (
        <SidebarProvider
            defaultOpen={false}
            style={{
                "--sidebar-width": "22rem",
                "--sidebar-width-mobile": "22rem",
            } as React.CSSProperties}
        >
            <div className="w-full h-screen py-2 overflow-hidden flex">
                <InventoryDataTable
                    columns={columns}
                    data={inventory}
                    addInventoryItem={addInventoryItem} />
                <InventoryItemSidebar
                    inventory={inventory}
                    updateInventoryItem={updateInventoryItem}
                    deleteInventoryItem={deleteInventoryItem}
                />
            </div>
            {/* <div className="flex w-full h-full">
                <div className="flex-grow overflow-hidden">
                    <div className="h-full overflow-auto py-2 box-border">
                        <InventoryDataTable
                            columns={columns}
                            data={inventory}
                            addInventoryItem={addInventoryItem} />
                    </div>
                </div>
                <InventoryItemSidebar
                    inventory={inventory}
                    updateInventoryItem={updateInventoryItem}
                    deleteInventoryItem={deleteInventoryItem}
                />
            </div> */}
        </SidebarProvider>
    )
}
