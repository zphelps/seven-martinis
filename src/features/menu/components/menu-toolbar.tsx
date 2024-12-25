import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MenuItem } from "@/types/order"
import { Table } from "@tanstack/react-table"
import { AddMenuItemProps } from "../hooks/use-menu"
import AddItemDialog from "@/features/inventory/components/add-item-dialog"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react"
import { Loader2 } from "lucide-react"
type MenuToolbarProps<TData> = {
    table: Table<TData>
    addMenuItem: (item: AddMenuItemProps) => Promise<MenuItem>
}

export const MenuToolbar = <TData, TValue>({ table, addMenuItem }: MenuToolbarProps<TData>) => {
    const [addingItem, setAddingItem] = useState(false)
    const router = useRouter()

    const handleAddMenuItem = async () => {
        setAddingItem(true)
        const newMenuItem = await addMenuItem({
            id: uuidv4(),
            name: "",
            description: "",
            instructions: "",
            available: false,
            drink_number: 0,
        })

        router.push(`/dashboard/menu?id=${newMenuItem.id}`)
        setAddingItem(false)
    }
    return (
        <div className="flex justify-between items-center p-2 space-x-2">
            {/* Search */}
            <Input
                placeholder="Search drinks..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                }
            />
            {/* Add Item */}
            <Button variant="default" onClick={handleAddMenuItem} disabled={addingItem}>
                {addingItem ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Drink"}
            </Button>
        </div>
    )
}