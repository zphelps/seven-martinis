"use client"

import { MenuItem } from "@/types/order"
import { CheckIcon } from "@heroicons/react/24/outline"
import { ColumnDef } from "@tanstack/react-table"
import { XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
        cell: ({ row }) => {
            const name = row.original.name
            return (
                <div className="flex items-center">
                    {name && name !== "" && <p className="text-black hover:cursor-pointer">
                        {name || ""}
                    </p>}
                    {(!name || name === "") && (
                        <Badge variant="outline" className="font-normal border-red-200 text-red-400 text-xs">
                            No name
                        </Badge>
                    )}
                </div>
            )
        }
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