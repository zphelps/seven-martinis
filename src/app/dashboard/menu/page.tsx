"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { columns } from "@/features/menu/components/columns"
import { MenuDataTable } from "@/features/menu/components/data-table"
import MenuItemSidebar from "@/features/menu/components/menu-item-sidebar"
import useMenu from "@/features/menu/hooks/use-menu"
import { MenuItem } from "@/types/order"
import { Loader2 } from "lucide-react"

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
