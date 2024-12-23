"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { columns } from "@/features/inventory/components/columns"
import { DataTable } from "@/features/inventory/components/data-table"
import InventoryItemSidebar from "@/features/inventory/components/inventory-item-sidebar"
import useInventory from "@/features/inventory/hooks/use-inventory"
import { Loader2 } from "lucide-react"

export default function InventoryPage() {
    const { inventory, updateInventoryItem, loading, error, addInventoryItem } = useInventory()

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
                "--sidebar-width": "25rem",
                "--sidebar-width-mobile": "25rem",
            } as React.CSSProperties}
        >
            <div className="flex w-full h-full">
                <div className="flex-grow overflow-hidden">
                    <div className="h-full overflow-auto py-2 box-border">
                        <DataTable
                            columns={columns}
                            data={inventory}
                            addInventoryItem={addInventoryItem} />
                    </div>
                </div>
                <InventoryItemSidebar
                    inventory={inventory}
                    updateInventoryItem={updateInventoryItem}
                />
            </div>
        </SidebarProvider>
    )
}
