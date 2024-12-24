"use client"

import { MenuItem } from "@/types/order"
import { CheckIcon } from "@heroicons/react/24/outline"
import { ColumnDef } from "@tanstack/react-table"
import { XIcon } from "lucide-react"

export const columns: ColumnDef<MenuItem>[] = [
    {
        accessorKey: "drink_number",
        header: "#",
        cell: ({ row }) => {
            const drinkNumber = row.original.drink_number
            return <div>#{drinkNumber}</div>
        }
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "available",
        header: () => <div className="flex items-center gap-2 w-full justify-center">Available</div>,
        cell: ({ row }) => {
            const item = row.original as MenuItem
            const available = item.available
            return <div className="flex items-center gap-2 w-full justify-center">
                {available ? <CheckIcon className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
            </div>
        }
    },
]