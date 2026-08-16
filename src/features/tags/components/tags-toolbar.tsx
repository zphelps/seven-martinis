import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"
import { Tag } from "@/types/order"
import AddTagDialog from "./add-tag-dialog"
import { AddTagProps } from "../hooks/use-tags"

type TagsToolbarProps<TData> = {
    table: Table<TData>
    addTag: (tag: AddTagProps) => Promise<Tag>
}

export const TagsToolbar = <TData, TValue>({ table, addTag }: TagsToolbarProps<TData>) => {
    return (
        <div className="flex justify-between items-center p-2 space-x-2">
            <Input
                placeholder="Search tags..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                }
            />
            <AddTagDialog addTag={addTag}>
                <Button variant="default">
                    + Add Tag
                </Button>
            </AddTagDialog>
        </div>
    )
}
