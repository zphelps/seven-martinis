"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { columns } from "@/features/menu/components/columns"
import { MenuDataTable } from "@/features/menu/components/data-table"
import MenuItemSidebar from "@/features/menu/components/item-sidebar"
import useMenu from "@/features/menu/hooks/use-menu"
import { Loader2, Martini } from "lucide-react"

export default function MenuPage() {
    const { menuItems,
        loading,
        error,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem
    } = useMenu({ onlyAvailable: false })

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center animate-pulse border border-primary/10">
                    <Martini className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground">Loading menu...</p>
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
                <MenuDataTable
                    columns={columns}
                    data={menuItems}
                    addMenuItem={addMenuItem} />
                <MenuItemSidebar
                    menu={menuItems}
                    updateMenuItem={updateMenuItem}
                    deleteMenuItem={deleteMenuItem}
                />
            </div>
        </SidebarProvider>
    )
}
