"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ImageIcon } from "lucide-react"
import { Tag } from "@/types/order"
import { Badge } from "@/components/ui/badge"

export interface TagWithCounts extends Tag {
    totalDrinks: number
    availableDrinks: number
}

export const columns: ColumnDef<TagWithCounts>[] = [
    {
        accessorKey: "image_url",
        header: () => <ImageIcon className="ml-3 w-4 h-4" />,
        cell: ({ row }) => {
            const imageUrl = row.original.image_url
            return (
                <div className="w-10 h-10 rounded-md overflow-hidden bg-white">
                    {imageUrl ? <img src={imageUrl} alt={row.original.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                        <p className="text-xs text-center text-gray-500">No Image</p>
                    </div>}
                </div>
            )
        }
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "is_featured",
        header: "Featured",
        cell: ({ row }) => {
            return row.original.is_featured ? <Badge variant="default">Featured</Badge> : null
        }
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
            return row.original.is_active ? null : <Badge variant="destructive">Disabled</Badge>
        }
    },
    {
        accessorKey: "totalDrinks",
        header: "Tagged Drinks",
        cell: ({ row }) => row.original.totalDrinks,
    },
    {
        accessorKey: "availableDrinks",
        header: "Available Drinks",
        cell: ({ row }) => row.original.availableDrinks,
    },
]
