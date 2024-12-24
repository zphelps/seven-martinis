import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MenuItem } from "@/types/order"
import { Table } from "@tanstack/react-table"
import { AddMenuItemProps } from "../hooks/use-menu"
import AddItemDialog from "@/features/inventory/components/add-item-dialog"

type MenuToolbarProps<TData> = {
    table: Table<TData>
    addMenuItem: (item: AddMenuItemProps) => Promise<MenuItem>
}

export const MenuToolbar = <TData, TValue>({ table, addMenuItem }: MenuToolbarProps<TData>) => {
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
            <Button variant="default">
                + Add Drink
            </Button>
        </div>
    )
}