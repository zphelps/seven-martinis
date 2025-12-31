"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { columns } from "@/features/inventory/components/columns"
import { InventoryDataTable } from "@/features/inventory/components/data-table"
import InventoryItemSidebar from "@/features/inventory/components/inventory-item-sidebar"
import useInventory from "@/features/inventory/hooks/use-inventory"
import { Loader2, Package } from "lucide-react"

export default function InventoryPage() {
    const { inventory,
        updateInventoryItem,
        loading,
        error,
        addInventoryItem,
        deleteInventoryItem } = useInventory()

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center animate-pulse border border-primary/10">
                    <Package className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground">Loading inventory...</p>
            </div>
        )
    }
    if (error) return <div className="text-destructive p-4">Error: {error}</div>

    return (
        <SidebarProvider
            defaultOpen={false}
            style={{
                "--sidebar-width": "22rem",
                "--sidebar-width-mobile": "22rem",
            } as React.CSSProperties}
        >
            <div className="w-full h-screen py-2 overflow-hidden flex bg-background">
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
        </SidebarProvider>
    )
}
