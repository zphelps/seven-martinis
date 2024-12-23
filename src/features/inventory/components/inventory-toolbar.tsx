import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"
import { InventoryItem } from "./columns"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import AddItemDialog from "./add-item-dialog"
import { AddInventoryItemProps } from "../hooks/use-inventory"

type InventoryToolbarProps<TData> = {
    table: Table<TData>
    addInventoryItem: (item: AddInventoryItemProps) => Promise<InventoryItem>
}

export const InventoryToolbar = <TData, TValue>({ table, addInventoryItem }: InventoryToolbarProps<TData>) => {
    return (
        <div className="flex justify-between items-center p-2 space-x-2">
            {/* Search */}
            <Input
                placeholder="Search inventory..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                }
            />
            {/* Add Item */}
            <AddItemDialog addInventoryItem={addInventoryItem}>
                <Button variant="default">
                    + Add Item
                </Button>
            </AddItemDialog>
        </div>
    )
}